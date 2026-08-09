import { HttpClient, HttpContext } from '@angular/common/http';
import { computed, effect, inject, Service, signal } from '@angular/core';
import { AuthApiData, AuthModel, RefreshTokenApiResponse, RegisterUserData } from './auth.model';
import { PreferencesService } from '../../shared/services/preferences/preferences.service';
import { firstValueFrom, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SkipLoading } from '../../shared/ui/loading/skip-loading.component';
import { OverlayService } from '../../shared/services/overlay/overlay.service';

const AUTH_DATA = '_auth_data';


@Service()
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly preferenceSrv = inject(PreferencesService);
  private readonly overlaySrv = inject(OverlayService);

  #user = signal<AuthModel | null>(null);
  user = this.#user.asReadonly();

  isLoggedIn = computed(() => !!this.user());

  constructor() {
    this.initializeUserEffect();
  }

  /**
   * Sets up an effect that automatically persists user data to storage when the user state changes
   * @private
   */
  private initializeUserEffect(): void {
    effect(() => {
      const user = this.user();
      if (user) {
        this.preferenceSrv.setPreference(AUTH_DATA, JSON.stringify(user));
      }
    });
  }
  
  /**
   * Loads user authentication data from local storage and sets the user state
   * @returns Promise resolving to the loaded user data or null if no data exists
   */
  async loadUserFromStorage(): Promise<AuthModel | null> {

    const storedData = await this.preferenceSrv.getPreference(AUTH_DATA);

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const user = new AuthModel(
        parsedData.id,
        parsedData.email,
        parsedData.username,
        parsedData.firstName,
        parsedData.lastName,
        parsedData.phone,
        parsedData.active,
        parsedData.roleId,
        parsedData.role,
        parsedData.token,
        parsedData.refreshToken,
        new Date(parsedData.tokenExpirationDate)
      );

      this.#user.set(user);
      return user;    
    }

    return null;

  }

  /**
   * Authenticates a user with username and password
   * @param userName - The user's username
   * @param password - The user's password
   * @returns Promise resolving to the authentication data from the API
   * @throws Error if login fails
   */
  async login(userName: string, password: string): Promise<AuthApiData> {
    return await firstValueFrom(
      this.http.post<AuthApiData>(
        // `${environment.apiUrl}/LOGIN/LOGIN`, 
        `${environment.api}/Login/Login`, 
        { userName, password })
       .pipe(
          tap(user => this.setUser(user))
        )
    );
  }

  async register(userData: Partial<RegisterUserData>): Promise<boolean> {

    const { firstName, lastName, email, phone, userName, password } = userData;

    return await firstValueFrom(
      this.http.post<boolean>(
        `${environment.apiUrl}/LOGIN/REGISTER`, 
        { firstName, lastName, email, phone, userName, password }
      ).pipe(
        map((response: any) => {
            return response ? true : false;
        })
      )
    );
  }

  /**
   * Sets the authenticated user data and persists it to local storage
   * 
   * @param authData 
   * @returns 
   */
  setUser(authData: AuthApiData): AuthModel {

    const user = new AuthModel(
      authData.id,
      authData.email,
      authData.userName,
      authData.firstName,
      authData.lastName,
      authData.phone,
      authData.active,
      authData.roleId,
      authData.roleName,
      authData.token,
      authData.refreshToken,
      new Date(new Date().getTime() + authData.expiresIn * 1000)
    );

    this.preferenceSrv.setPreference(AUTH_DATA, JSON.stringify(user));
    this.#user.set(user);
    return user;

  }

  /**
   * 
   * 
   * @param user 
   * @returns 
   */
  async refreshToken(user: AuthModel | null): Promise<RefreshTokenApiResponse> {

    const user$ = this.http.post<RefreshTokenApiResponse>(
      // `${environment.apiUrl}/Login/CheckRefreshToke`,
      `${environment.api}/Login/CheckRefreshToke`,
      {
        userName: user!.username,
        accessToken: user!.token,
        refreshToken: user!.refreshToken
      },
      {
        context: new HttpContext().set(SkipLoading, true)
      }
    );

    return await firstValueFrom(user$);
    
  }

  /**
   * 
   * 
   * @param data 
   * @param userData 
   * @returns 
   */
  setUserAfterTokenRefresh(data: RefreshTokenApiResponse, userData: AuthModel): AuthModel {

    const user = new AuthModel(
      userData.id,
      userData.email,
      userData.username,
      userData.firstName,
      userData.lastName,
      userData.phone,
      userData.active,
      userData.roleId,
      userData.role,
      data.newAccessTokne,
      data.newRefreshToken,
      new Date(new Date().getTime() + data.expiresIn * 1000)
    );
    this.#user.set(user);
    return user;
  }

  /**
   * 
   */
  async logout(): Promise<void> {

    this.#user.set(null);
    await this.preferenceSrv.removePreference(AUTH_DATA);
    this.overlaySrv.closeAllOverlays();

  }

}
