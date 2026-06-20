import { inject, Injectable, Service } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Service()
/**
 * Service class for managing overlays
 * 
 * @class OverlayService
 */
export class OverlayService {

  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private overlayContainer = inject(OverlayContainer);
  private bottomSheet = inject(MatBottomSheet);

  /**
   * Close all overlays
   */
  closeAllOverlays(): void {
    // Close all snack bars
    this.snackBar.dismiss();

    // Close all dialogs
    this.dialog.closeAll();

    // Close all bottom sheets
    this.bottomSheet.dismiss();

    // Close all overlays
    const overlayContainers = this.overlayContainer.getContainerElement().querySelectorAll('.cdk-overlay-container');
    overlayContainers.forEach(container => {
      container.innerHTML = '';
    });

  }
}
