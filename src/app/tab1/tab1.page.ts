import { Component } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { NewArticlePage } from '../new-article/new-article.page';
import { NewHousePage } from '../new-house/new-house.page';
import { ListArticlePage } from '../list-article/list-article.page';
import { ProfilPage } from '../profil/profil.page';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  slideOpts={
    slidesPerView:1,
    spaceBetween:3,
    pager:true,
    // centeredSlides:true,
    initialSlide:1,
    speed:2000,
    loop:true,
    autoplay:{delay:2000},
    pagination:{
      el:'.swiper-pagination',
      type:'progressbar',
      clickable:true,
    }
  };
  admin:boolean=false
  profil
  constructor(public fx:FunctionsService,public storage:Storage) {
    this.fx.connect()
    this.getData()
  }
  articles:any=[]
  getData(){
    // this.fx.chargement('create')
    this.fx.http.get<any>(this.fx.server+'?articles').subscribe(reponse=>{
        this.articles=reponse.data
        this.storage.set('articles',reponse.data)
        this.topArt()
        // this.fx.chargement('kill')
   },err=>{
     this.storage.get('articles').then(value=>{
       this.articles=value
       console.log(this.articles)
       this.topArt()
       
     })
   })
  }
  top:any
  topArt(){// 4 magasins aleatoire
    this.top=[]
    if(this.articles!=undefined && this.articles!=null && this.articles!=''){
          for (let i = 0; i < 4; i++) {
            var mag = this.articles[Math.floor(Math.random() * this.articles.length)]   
                             
            if(mag[0]!=undefined){
              this.top.push(mag)
          }
        }
      }
      else{
        this.top=null
      }
  }
  // Click on one option
  openWin(title:string){
    if (title=='article') {
      this.fx.openWin(NewArticlePage)
    }
    else if (title=='house') {
      this.fx.openWin(NewHousePage)
    }
    else if (title=='articles') {
      this.fx.openWin(ListArticlePage)
    }
    else if (title=='profil') {
      this.fx.openWin(ProfilPage)
    }
  }
  newCart(index){
    var article=this.articles.filter(el=>el.id==index)[0]
    this.storage.get('panier').then(value=>{
    var exist=value.filter(el=>el.id==index)
    if(exist.length==1){
      this.fx.toastMsg(article.title+' Existe deja au panier','warning',1000)
    }
    if(exist.length==0){
    this.fx.toastMsg(article.title+' Articles ajouter au panier','primary',1000)
    value.push(article);//Ajout du dernier article dans les articles du panier
    this.storage.set('panier',value);
    this.fx.nbPanier+=1;
  }
      }).catch(err=>{
        this.fx.toastMsg(article.title+' Articles ajouter au panier','primary',1000)
        this.storage.set('panier',[article]);
        this.fx.nbPanier+=1;
      })
      
  }
  doRefresh(event) {
     this.getData()
    // this.refresh();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
