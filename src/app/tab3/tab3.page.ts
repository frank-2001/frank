import { Component } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
cmds:any
one=0
  constructor(public fx:FunctionsService,public storage:Storage) {
    this.init() 
    this.getCmd()
    this.fx.connect()
    this.storage.get('profil').then(value=>{
      this.profil=value[0]
    }).catch(()=>{
      this.profil=this.fx.profil
    })
  }
  async confirm(id,state){
    var load =await this.fx.loading.create({
      cssClass: 'loading',
      message:"Chargement...",
      keyboardClose:true,
      id:"home"
    })
    await load.present()
    this.fx.http.get<any>(this.fx.server+'?getCmd&cmd='+id+'&confirm='+state).subscribe(reponse=>{
      if (reponse.state==true){
        var col='primary'
        this.getCmd()
        this.one=0
        this.fx.update()
       }else{ var col='danger'}
    load.dismiss()
    this.fx.toastMsg(reponse.message,col,2000)
    },err=>{
      this.fx.testNet()
      load.dismiss()
    })
  }
  cmd:any
  oneCmd(id){
    this.cmd=this.cmds.filter(el=>el.id==id)
    this.one=1
    console.log(this.cmd);
    
  }

  profil:any
  async getCmd(){ //Toutes les commandes
    var load =await this.fx.loading.create({
      cssClass: 'loading',
      message:"Chargement...",
      keyboardClose:true,
      id:"home"
    })
    await load.present()

      if (this.profil!=undefined){
        var id
        if(this.profil.admin=='1'){ id=0 }else{id=this.profil.id}
          this.fx.http.get<any>(this.fx.server+'?getCmd&id='+id).subscribe(reponse=>{
            this.cmds=reponse.data            
            for (let index = 0; index < this.cmds.length; index++) {
              this.cmds[index].articles=JSON.parse(this.cmds[index].articles)
            }
            this.storage.set('journal',this.cmds);
            load.dismiss()
            console.log(this.cmds);
            
          },err=>{
            this.storage.get('journal').then(value=>{
              this.cmds=value           
              for (let index = 0; index < this.cmds.length; index++) {
                this.cmds[index].articles=JSON.parse(this.cmds[index].articles)
              }            
            })
            this.fx.testNet()
            load.dismiss()
          })
      }else{
        load.dismiss()
        this.cmds=undefined
      }
  }
  async init() {
    const storage = await this.storage.create();
  }
}
