import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { Storage } from '@ionic/storage-angular';
import { ListArticlePage } from '../list-article/list-article.page';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-new-article',
  templateUrl: './new-article.page.html',
  styleUrls: ['./new-article.page.scss'],
})
export class NewArticlePage implements OnInit {
  article:any={names:null,price:null,devise:null,entrer:null,libele:null,house:null,sortie:null,id:null,idHouse:null}
  house:any
  time=new Date()
  profil:any
  constructor(public fx:FunctionsService,public storage:Storage) {
    // recupere all house
    this.getHouse()
    this.storage.get('profil').then(value=>{
      this.profil=value
    })
   }
     // Get Data by storage DB
  getHouse(){
    this.init()
    this.storage.get('house').then(val=>{
      this.house=val
    }).catch(err=>{
      this.house=[]
    })
  }
  // This function save article in a bdd storage
  saveArticle(){
    console.log("Save article");
    if(this.article.names==null || this.article.price==null || this.article.devise==null || this.article.entrer==null || this.article.libele==null || this.article.house==null){
      this.fx.toastMsg("Veuillez ramplir le formulaire","warning",2000)
      console.log("Veuillez ramplir le formulaire");
    }
    else if(this.article.price<=0){
      this.fx.toastMsg("Prix doit etre superieur a 0 "+this.article.devise,"danger",2000)
    }
    else if(this.article.entrer<0){
      this.fx.toastMsg("La quantite est invalide","danger",2000)
    }
    else{
      console.log(this.article);
      this.article.sortie=0
      this.storage.get('articles').then(values=>{
        var testExist
        var id
        var idHouse=this.house.filter(el=>el.names.toUpperCase()==this.article.house.toUpperCase())
        this.article.idHouse=idHouse[0].id
        if (this.profil==null) {
          this.profil=[{id:0}]
        }
        this.article.id=this.profil.id+''+''+this.time.getTime()
        if(values==null){
          testExist=[]
          console.log("Values=null");
          
        }else{
          var houseArt:any=values.filter(el=>el.house.toUpperCase()==this.article.house.toUpperCase())
          testExist=houseArt.filter(el=>el.names.toUpperCase()==this.article.names.toUpperCase())
          console.log("Filtre values");
          console.log(testExist);
        }
        if(testExist.length==0){
          console.log(testExist.length);
          
          this.fx.saveStorage('articles',this.article,'update','close')
          this.storage.get('mouvementStock').then(value=>{
            console.log(values+'  dans mouv')
            var detail:any={id:this.article.id,pu:this.article.price,payment:undefined,names:this.article.names,action:"Entrer",house:this.article.house,qte:this.article.entrer,cout:this.article.entrer*this.article.price,devise:this.article.devise,time:this.time.getTime(),state:0,idArticle:this.article.id}
            this.fx.saveStorage("mouvementStock",detail,"update",'close')
            this.fx.toastMsg("Article crée avec success","primary",3000)
          }).catch(err=>{
            console.log(values+'  dans mouv')
            var detail:any={id:0,pu:this.article.price,payment:undefined,names:this.article.names,action:"Entrer",house:this.article.house,qte:this.article.entrer,cout:this.article.entrer*this.article.price,devise:this.article.devise,time:this.time.getTime(),state:0,idArticle:this.article.id}
            this.fx.saveStorage("mouvementStock",detail,"update",'close')
            this.fx.toastMsg("Article crée avec success","primary",3000)
          })
        }else{
          console.log(testExist.length);
          this.fx.toastMsg('Un article a ce nom existe deja dans '+this.article.house,'warning',3000)
        }
      })
    }
  }

  ngOnInit() {
  }
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
  }

}
