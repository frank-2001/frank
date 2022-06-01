import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { Storage } from '@ionic/storage-angular';
@Component({
  selector: 'app-list-article',
  templateUrl: './list-article.page.html',
  styleUrls: ['./list-article.page.scss'],
})
export class ListArticlePage implements OnInit {
articles:any=[]
list:number=1
article:any
time=new Date()
admin:boolean=false
profil:any

mouvement:any={etat:null,qte:null,pay:null,libele:null,pu:null,devise:null,libeel:null}
constructor(public fx:FunctionsService,public storage:Storage) {
    this.init()
    this.getArticle()
    // this.fx.connect()
    this.storage.get('profil').then(values=>{
      console.log(values);
      this.profil=values
      if(values.logo=='logo.png'){
        this.admin=true
      }
    console.log(this.admin);
    })
   }
   onKey(event: any) { // without type info
    if(event.keyCode==8){
      this.getArticle()
    }    
    var word:string=''
    word+=event.target.value
    this.articles=this.articles.filter(el=>el.names.toUpperCase().indexOf(word.toUpperCase())>-1)
    console.log(this.articles);
    console.log(word); 
    this.list=1   
    }
    getArticle(){
      this.storage.get('articles').then(values=>{
      this.articles=values
      console.log(this.article);
      })

    }
    mouv:any
    caisseAmountFc:number=0
    caisseAmountDol:number=0
    // Voir un seul artile recoit l'id de l'article et renvoie les donnees de l'article 
    oneArticle(id){
      console.log(id);
      this.storage.get('articles').then(valuesA=>{
      this.article=valuesA.filter(el=>el.id==id)
      this.mouvement.pu=this.article[0].price
      this.mouvement.devise=this.article[0].devise
      console.log(this.article);
    })
    // Calculs de la caisse
    this.storage.get('mouvementStock').then(values=>{
        console.log(values);
        if(values!=null){
          this.mouv=values.filter(el=>el.idArticle==id)
          console.log(this.mouv);
          var caisse=this.mouv.filter(el=>el.payment=='Cash' || el.payment=='Reglement')
          this.caisseAmountFc=0
          this.caisseAmountDol=0
          for (let n = 0; n < caisse.length; n++) {
            if(caisse[n].devise=='Fc'){
              this.caisseAmountFc+=caisse[n].cout
            }
            if(caisse[n].devise=='$'){
              this.caisseAmountDol+=caisse[n].cout
            }
          }
          console.log(this.caisseAmountFc+' Fc --'+this.caisseAmountDol+' $');
        }
      })
      this.list=0
      // this.fx.openWin(OneArticlePage)
    }
    // 
    remove(id){
      this.getArticle()
      var newArticle=this.articles.filter(el=>el.id!=id)
      console.log(id);
      
      console.log(this.articles.filter(el=>el.id==id));
      
      this.storage.set('articles',newArticle)
      this.storage.get('mouvementStock').then(values=>{
        var newM=values.filter(el=>el.id!=id)
        this.storage.set('mouvementStock',newM)
      })
      this.fx.dismiss()
      this.fx.toastMsg('Article supprimer avec success','danger',4000)      
      this.fx.openWin(ListArticlePage)
    }
    articleUpdate(){
      if(this.mouvement.etat!=null && this.mouvement.qte!=null && this.mouvement.libele!=null && this.mouvement.pu!=null && this.mouvement.devise!=null && this.mouvement.qte>0){
       var id
        if(this.mouv==null){
          id=0
        }else{
          id=this.mouv.length
        }
        var detail={id:id,pu:this.mouvement.pu,payment:this.mouvement.pay,names:this.article[0].names,action:this.mouvement.etat,house:this.article[0].house,qte:this.mouvement.qte,cout:this.mouvement.qte*this.mouvement.pu,devise:this.mouvement.devise,time:this.time.getTime(),state:0,idArticle:this.article[0].id,libele:this.mouvement.libele}
        console.log(detail);
        if(this.mouvement.etat=="Sortie" && this.mouvement.pay!=null){
          if(this.mouvement.qte<=(this.article[0].entrer-this.article[0].sortie)){
            this.fx.saveStorage("mouvementStock",detail,"update",'')
            //Update informations
            this.article[0].sortie+=this.mouvement.qte
            this.getArticle()
            this.articles=this.articles.filter(el=>el.names!=this.article[0].names)
            console.log(this.article[0]);
            this.articles.unshift(this.article[0])
            this.storage.set('articles',this.articles).then(()=>{
              this.fx.toastMsg("Sortie de "+this.mouvement.qte+" "+this.article[0].names+" avec succees","medium",4000)
              this.mouvement.etat=null
              this.mouvement.qte=null
              this.mouvement.pay=null
              this.update()
            })
          }
          else{
            console.log(this.mouvement.qte+" < "+(this.article[0].entrer-this.article[0].sortie));   
            this.fx.toastMsg("Quantité de sortie invalide ","warning",4000)
          }
        }
        if(this.mouvement.etat=="Entrer"){
          //upDate Informations
          this.fx.saveStorage("mouvementStock",detail,"update",'')
          this.article[0].entrer+=this.mouvement.qte
          this.getArticle()
          this.articles=this.articles.filter(el=>el.id!=this.article[0].id)
          this.articles.unshift(this.article[0])
          this.storage.set('articles',this.articles).then(()=>{
          //Output
              this.fx.toastMsg("Entrer de "+this.mouvement.qte+" "+this.article[0].names+" avec succees","medium",4000)
              this.mouvement.etat=null
              this.mouvement.qte=null
              this.mouvement.pay=null
              this.update()
            })
        }
        else{
          console.log("Methode de payment invalide");
        }
      }
      else{
        this.fx.toastMsg("Formulaire non complet !","warning",2000)
      }
    }
    update(){
      this.oneArticle(this.article[0].id)
    }
  ngOnInit() {
  }
  async init() {
    const storage = await this.storage.create();
  }
}
