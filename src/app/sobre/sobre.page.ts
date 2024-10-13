import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
})
export class SobrePage implements OnInit {

  
  constructor(private modalController: ModalController) { }

  dismissModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

}
