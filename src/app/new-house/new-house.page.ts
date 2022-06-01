import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { Storage } from '@ionic/storage-angular';
import { __values } from 'tslib';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-new-house',
  templateUrl: './new-house.page.html',
  styleUrls: ['./new-house.page.scss'],
})
export class NewHousePage implements OnInit {
  article:any={names:null,libele:null,id:null}
  // dataUser:any={names:null,password:null,idAdmin:null,house:null}
  house:any=[]
  user:number=0
  profil:any
  menu:any=[]
  time=new Date()
  constructor(public http:HttpClient,public fx:FunctionsService,public storage:Storage) {
    this.init()
    this.storage.get('house').then(values=>{
      this.house=values
      for (let i = 0; i < values.length; i++) {
        this.menu.push(values[i].names)
      }
      console.log(this.menu)
      console.log(this.house); 
    })
    this.storage.get('profil').then(values=>{
      this.profil=values
      console.log(this.profil); 
    })
   }
  // This function save the house in a bdd storage
  saveHouse(){
    var myHouse={house:this.article,articles:[],mouv:[]}
    console.log("Save house");
    console.log(this.house);
    var lenHouse
    if(this.house==null){
      lenHouse=0
    }else{
      lenHouse=this.house.filter(el=>el.names.toUpperCase()==this.article.names.toUpperCase()).length
    }
    if (this.profil==null) {
      this.profil=[{id:0}]
      this.article.id=this.profil.id+''+''+this.time.getTime()            
    }
    this.article.id=this.profil.id+''+''+this.time.getTime()            

      if(lenHouse==0){
        this.saveBdd(myHouse)        
      }else{
        this.fx.toastMsg("Maison existe deja","warning",3000)
    }
  }
  saveBdd(myHouse){
        console.log("House crée avec success");
        this.http.post<any>(this.fx.server+'?newHouse&house-name='+this.article.names+'&id-admin='+this.profil.id,myHouse).subscribe(reponse=>{
          this.fx.toastHttp(reponse,3000)
        },error=>{
          this.fx.testNet()
        })
        this.fx.saveStorage('house',this.article,'update','close')
  }
  names:any
  onkey(event: any,names:any) { // without type info
    console.log(event.keyCode,names);
      this.names=this.names.replace(' ','')
      this.names=this.names.toLowerCase()
    }
  load=null
  saveUser(names,password,house){
    this.load=0
    console.log(names,password,house,this.profil.id);
    this.http.get<any>(this.fx.server+'?nUser&name='+names+'&password='+password+'&house='+house+'&idAdmin='+this.profil.id).subscribe(reponse=>{
      this.fx.toastHttp(reponse,3000)
      if (reponse.state==true) {
        this.fx.dismiss()
      }      
      this.load=1
    },error=>{
      this.fx.testNet()
      this.load=1
    })
  }
  ngOnInit() {
  }
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
  }
}
