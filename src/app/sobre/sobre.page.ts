import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
})
export class SobrePage implements OnInit {

  
  constructor(private router: Router, private modalController: ModalController) { }

  async irPara(caminho: string) {
    this.router.navigate([`/tabs/${caminho}`]); 
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {
  }

}
