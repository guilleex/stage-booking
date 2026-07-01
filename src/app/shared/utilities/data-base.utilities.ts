import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParamsOptions } from "@angular/common/http";
import { firstValueFrom, map, Observable, tap } from "rxjs";

/**
 * Injectable service providing utility methods for common HTTP operations.
 * Handles GET, POST, PUT, PATCH, DELETE requests and value validation.
 */
@Injectable({ providedIn: 'root' })
export class DataBaseUtilities {

  /** Injects HttpClient for making HTTP requests */
  private readonly http = inject(HttpClient);

  /**
   * Fetch data from the API and update a signal with the response.
   * 
   * @param url - The API endpoint URL.
   * @param signal - The signal to update with the fetched data.
   * @param mapFn - Optional mapping function to transform the response data.
   * @returns {Promise<T>} Promise that resolves with the fetched data.
   */
  fetch<T>(url: string, signal: any, mapFn?: (data: any) => any): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(url).pipe(
        mapFn ? map(mapFn) : tap(),
        tap(data => signal.set(data))
      )
    );
  }

  /**
   * Fetch data from the API with query parameters and update a signal with the response.
   * 
   * @param url - The API endpoint URL.
   * @param params - Object containing query parameters.
   * @param signal - The signal to update with the fetched data.
   * @param mapFn - Optional mapping function to transform the response data.
   * @returns {Promise<T>} Promise that resolves with the fetched data.
   */
  fetchWithParams<T>(url: string, params: {[key: string]: any}, signal: any, mapFn?: (data: any) => any): Promise<T> {
    let httpParams = new HttpParams();
    
    // Add each parameter to HttpParams
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return firstValueFrom(
      this.http.get<T>(url, { params: httpParams }).pipe(
        mapFn ? map(mapFn) : tap(),
        tap(data => signal.set(data))
      )
    );
  }

  /**
   * Send data to the API using POST method.
   * 
   * @param url - The API endpoint URL.
   * @param data - The data payload to send in the request body.
   * @param mapFn - Optional mapping function to transform the response data.
   * @returns {Promise<T>} Promise that resolves with the API response.
   */
  post<T>(url: string, data: any, mapFn?: (data: any) => any): Promise<T> {
    return firstValueFrom(
      this.http.post<T>(url, data).pipe(
        mapFn ? map(mapFn) : tap()
      )
    );
  }

  /**
   * Partially update data on the API using PATCH method.
   * 
   * @param url - The API endpoint URL.
   * @param data - The partial data payload to update.
   * @param mapFn - Optional mapping function to transform the response data.
   * @returns {Promise<T>} Promise that resolves with the updated resource.
   */
  patch<T>(url: string, data: any, mapFn?: (data: any) => any): Promise<T> {
    return firstValueFrom(
      this.http.patch<T>(url, data).pipe(
        mapFn ? map(mapFn) : tap()
      )
    );
  }

  /**
   * Replace or create data on the API using PUT method.
   * 
   * @param url - The API endpoint URL.
   * @param data - The complete data payload to replace the resource.
   * @param mapFn - Optional mapping function to transform the response data.
   * @returns {Promise<T>} Promise that resolves with the replaced/created resource.
   */
  put<T>(url: string, data: any, mapFn?: (data: any) => any): Promise<T> {
    return firstValueFrom(
      this.http.put<T>(url, data).pipe(
        mapFn ? map(mapFn) : tap()
      )
    );
  }

  /**
   * Deletes data from the API using DELETE method.
   * 
   * @param property - The property name to filter the deletion.
   * @param value - The value of the property to delete.
   * @param url - The API endpoint URL for the deletion request.
   * @returns {Promise<T>} Promise that resolves with the deletion confirmation or response.
   */
  delete<T>(property: string, value: number | string , url: string): Promise<T> {

    const params = new HttpParams().set(property, value);

    return firstValueFrom(
      this.http.delete<T>(url, { params })
    );
  }

  deleteWithParams<T>(params: {[key: string]: any}, url: string): Promise<T> {    

    let httpParams = new HttpParams();
    
    // Add each parameter to HttpParams
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {        
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return firstValueFrom(
      this.http.delete<T>(url, { params: httpParams })
    );

  }

  // /**
  //  * Delete data with parameters in request body.
  //  * Note: While HTTP DELETE with body is allowed by spec, it's not commonly used.
  //  * Some proxies/firewalls might strip the body. Use with caution.
  //  * 
  //  * @param body - The data to send in the request body.
  //  * @param url - The API endpoint URL for the deletion request.
  //  * @returns {Promise<T>} Promise that resolves with the deletion response.
  //  */
  // deleteWithBody<T>(body: any, url: string): Promise<T> {
  //   return firstValueFrom(
  //     this.http.delete<T>(url, { body })
  //   );
  // }

  // /**
  //  * Delete data with both query parameters and request body.
  //  * 
  //  * @param params - Query parameters to add to the URL.
  //  * @param body - The data to send in the request body.
  //  * @param url - The API endpoint URL for the deletion request.
  //  * @returns {Promise<T>} Promise that resolves with the deletion response.
  //  */
  // deleteWithParamsAndBody<T>(params: {[key: string]: any}, body: any, url: string): Promise<T> {
  //   let httpParams = new HttpParams();
    
  //   // Add each parameter to HttpParams
  //   Object.keys(params).forEach(key => {
  //     if (params[key] !== null && params[key] !== undefined) {
  //       httpParams = httpParams.set(key, params[key].toString());
  //     }
  //   });

  //   return firstValueFrom(
  //     this.http.delete<T>(url, { params: httpParams, body })
  //   );
  // }

  /**
   * Check if a specific value exists in the database for a given property.
   * Useful for validation to prevent duplicate entries.
   * 
   * @param value - The value to check for existence.
   * @param property - The property/field name to check against.
   * @param url - The API endpoint URL for the validation check.
   * @returns {Observable<boolean>} Observable that emits true if value exists, false otherwise.
   */
  isValueRegistered(value: string, property: string, url: string): Observable<boolean> {

    const params = new HttpParams().set(property, value);
        
    return this.http.get<boolean>(url, { params });

  }
}
