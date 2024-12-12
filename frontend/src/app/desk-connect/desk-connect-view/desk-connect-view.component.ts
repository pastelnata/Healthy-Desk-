import { Component, OnInit } from '@angular/core';
import { DeskApiService } from '../../services/desk-api.service';
import { Desk } from '../../models/DeskModel';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-desk-connect-view',
  templateUrl: './desk-connect-view.component.html',
  styleUrl: './desk-connect-view.component.css',
})
export class DeskConnectViewComponent {
  deskIds: string[] = [];
  desksInfos: Desk[] = [];
  isLoading: boolean = false;

  constructor(private deskApiService: DeskApiService, private cdr: ChangeDetectorRef) {}

  async loadDesksAndInfos() {
    console.log('Loading desks and infos...');
    this.deskIds = [];
    this.desksInfos = [];
    this.isLoading = true;

    await this.getDesks();
    console.log('Desks:', this.desksInfos);
  }

  async getDesks() {
    console.log('Getting desk IDs...');
    this.deskApiService.getDesks().subscribe(async (desksIds: string[]) => {
      this.deskIds = desksIds;
      console.log('Desk IDs:', this.deskIds);

      const deskInfo = this.deskIds.map(id => this.getDeskInfo(id));
      await Promise.all(deskInfo);

      console.log('Desks infos:', this.desksInfos);
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  async getDeskInfo(id: string) {
    console.log('Getting desk info...');
    return new Promise<Desk>((resolve) => {
      this.deskApiService.getDeskInfo(id).subscribe((desk: any) => {
        const deskInfo: Desk = {
          id: id,
          name: desk.config.name,
          manufacturer: desk.config.manufacturer,
          position_mm: desk.state.position_mm,
          status: desk.state.status,
          speed: desk.state.speed
        };
        this.desksInfos.push(deskInfo);
        resolve(deskInfo);
      });
    });
  }

  connectToDesk(id: string) {
    this.deskApiService.connectToDesk(id);
  }
}