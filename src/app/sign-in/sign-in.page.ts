import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { FunctionsService } from '../functions.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
admin:number=0
new:number=0
  constructor(public http:HttpClient,public fx:FunctionsService,public storage:Storage) { }
load=null
async connect(house,pass){
  var load =await this.fx.loading.create({
    cssClass: 'loading',
    message:"Chargement...",
    keyboardClose:true,
    id:"home"
  })
  await load.present()
  this.http.get<any>(this.fx.server+'?connect&telephone='+house+'&pass='+pass).subscribe(
  reponse=>{
    if (reponse.state==true){
      var col='primary'
      this.storage.set('profil',reponse.data)
      this.fx.dismiss()
      this.fx.profil=reponse.data[0]
     }else{ var col='danger'}
  load.dismiss()
  this.fx.toastMsg(reponse.message,col,2000)
  },error=>{
    load.dismiss()
    this.fx.testNet();
    console.log(error); 
  })
}
names:any
onkey(event: any,names:any) { // without type info
  console.log(event.keyCode,names);
    this.names=this.names.replace(' ','')
    this.names=this.names.toLowerCase()
  }
async saveAdmin(names,phone,password,adr){
  var load =await this.fx.loading.create({
    cssClass: 'loading',
    message:"Chargement...",
    keyboardClose:true,
    id:"home"
  })
  await load.present()
    this.http.get<any>(this.fx.server+'?newCustum&nom='+names+'&telephone='+phone+'&pass='+password+'&adresse='+adr).subscribe(reponse=>{    
    if (reponse.state==true){
       var col='primary'
       this.storage.set('profil',reponse.data)
       this.fx.dismiss()
      }else{ var col='danger'}
      load.dismiss()
    this.fx.toastMsg(reponse.message,col,2000)
  },error=>{
    load.dismiss()
    this.fx.testNet();
    console.log(error); 
  })
}
  ngOnInit() {
  }

}
