import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { FunctionsService } from '../functions.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  articles:any=[]
  cmd:any
  commande=0
  allCmd=0
  total=0
  constructor(public fx:FunctionsService,public storage:Storage) {
    // JSON.stringify
    // console.log(JSON.stringify({"frank":2,"num":"salut"}));
    this.storage.create();
    this.getPAnier() 
  }
  update(){
    this.myCmd=undefined
    this.allCmd=0
    this.commande=0
    this.total=0
    this.getPAnier() 
  }
getPAnier(){
  this.storage.get('panier').then(value=>{
    this.articles=value  
    this.cmd=this.articles[0] 
  })
}
delete(id){
    this.articles=this.articles.filter(el=>el.id!=id)
    this.storage.set('panier',this.articles).then(()=>{
      this.getPAnier()
    })
    this.fx.nbPanier-=1
    // this.getPAnier()
  }
myCmd:any
getCmd(id,qte){
  if(this.myCmd==undefined){
    this.myCmd=[]
  }
  console.log(this.articles); 
  console.log(id,' ',qte,' ',this.articles[0].price);
  this.myCmd.push({'id':id,'qte':qte,'pt':this.articles[0].price[0]*qte,'title':this.articles[0].title})
  this.total+=this.articles[0].price[0]*qte
  console.log(this.myCmd);
  this.cmd=undefined;
  this.delete(this.articles[0].id)
  this.allCmd=1
}
async sendCmd(){
  var load =await this.fx.loading.create({
    cssClass: 'loading',
    message:"Chargement...",
    keyboardClose:true,
    id:"home"
  })
  await load.present()
  var profil 
  this.storage.get('profil').then(value=>{
    profil=value
    console.log(profil);
    if (profil!=undefined){
      this.fx.http.get<any>(this.fx.server+'?achat&id='+profil[0].id+'&data='+JSON.stringify(this.myCmd)+'&prix='+this.total).subscribe(reponse=>{
        if (reponse.state==true){
          var col='primary'
          this.commande=0
          this.allCmd=0
          this.myCmd=undefined
         }else{ var col='danger'}
        this.fx.toastMsg(reponse.message,col,2000)
      },er=>{
        load.dismiss()
      },()=>{
        load.dismiss()
      })
      
    }else{
      load.dismiss()
      this.fx.toastMsg('Veuillez vous identifier','warning',4000)
    }
  }).catch(err=>{
    profil=undefined
  })

  


}
    async init() {
      // If using, define drivers here: await this.storage.defineDriver(/*...*/);
      const storage = await this.storage.create();
    }
}
