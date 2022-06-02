import { Component, OnInit } from '@angular/core';
import { FunctionsService } from '../functions.service';
import { Storage } from '@ionic/storage-angular';
import { HttpClient,HttpProgressEvent} from '@angular/common/http';
import { ResourceLoader } from '@angular/compiler';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
profil:any
agree:boolean=false
last:any
data:any={house:null,articles:null,mouvement:null}
load:number=0
sub:boolean
recharge=0
notif
contact
journalDecharge
menu=1
article
constructor(public http:HttpClient,public fx:FunctionsService,public storage:Storage) {
  this.fx.connect()
  this.storage.get('profil').then(values=>{
    this.fx.profil=values[0]
    this.update()
    this.getNotif()
  })
  this.journalDecharge=this.fx.journalDecharge
  this.storage.get('contact').then(value=>{
    this.contact=value
  })
}

// Traitement d'une demande de recharge
oneN:number
sNotif:number
async confirm(id,state,custum){
  this.fx.loadingFx(1,"Traitement en cours")
  this.http.get<any>(this.fx.server+'?recharge&confirm='+state+'&id='+custum+'&rech='+id).subscribe(reponse=>{
    this.getNotif()
    this.oneN=0
    this.sNotif=1
    this.fx.toastMsg(reponse.message,'primary',2000)
    this.update()
    this.fx.loadingFx(0)
  },eror=>{
    this.fx.loadingFx(0)
    this.fx.toastMsg("Erreur de connexion",'danger',2000)
  })
}

// Mis en jour des variables 
custums
update(){
  this.fx.update()
  this.getNotif()
  this.fx.getArticle()
  this.article=this.fx.article
  this.custums=this.fx.listCustums
  this.journalDecharge=this.fx.journalDecharge
  console.log(this.notif);
  this.http.get<any>(this.fx.server+'?getUser='+this.fx.profil.id).subscribe(reponse=>{
    if (reponse.state==true){
      var col='primary'
      this.storage.set('profil',reponse.data)
      this.fx.profil=reponse.data[0]
    }else{ var col='danger'}
    this.fx.toastMsg(reponse.message,col,2000)  })
}

//Recevoir les notifications
notifNb:number
getNotif(){
  this.notif=this.fx.rechargeNotif
  this.notifNb=this.notif.filter(el=>el.state==0).length
}

// Voir les details sur une notification
oneNot:any
getOne(id){
  console.log(id);
  this.oneNot=this.notif.filter(el=>el.id==id)[0];
}

//Demande de recharge compte 
montant
compteRech(montant,image){
  this.fx.loadingFx(1)
  this.storage.get('profil').then(value=>{
    if (value!=undefined) {
      this.http.get<any>(this.fx.server+'?recharge&montant='+montant+'&image='+image+'&id='+value[0].id).subscribe(reponse=>{
        if (reponse.state==true){
          var col='primary'
          this.recharge=0
          this.getNotif()
         }else{ var col='danger'}
         this.image=undefined
         this.montant=undefined
         this.fx.loadingFx(0)
        this.fx.toastMsg(reponse.message,col,2000)
      })
    }
  })
  
}

// Deconnexion
dec(){
this.fx.toastMsg('Deconnexion en cours....','danger',2000)
this.storage.remove('profil')
this.storage.remove('journal')
this.fx.profil=undefined
// this.fx.dismiss()
}

// Upload image
loading:any=[
  {  load:0,
    total:100.}
];
pourc:any;
activeProgress:boolean=false;
Selectedfile:File;
image:string;
hideBtn:boolean=false;
loadBtn:boolean=false;
images:any=null
async changed(event){
  this.fx.loadingFx(1,"Uploading...")
  this.activeProgress=true;
  this.Selectedfile = event.target.files[0];//Image et ses propriete
    this.activeProgress=true;//Active progresse bar
    var nb=0;//Compteur lors de l'upload
    var fileData=new FormData();//Transporteur requete Post
    fileData.append("Myfile",this.Selectedfile,this.Selectedfile.name);//Attribution des valeurs de l'image au transporteur
    this.http.post(this.fx.server+'?saveImg',fileData,{//Envoi de l'image
      reportProgress:true,
      observe:'events',
    }).subscribe(
      (events:HttpProgressEvent)=>{
      console.log(events.type)
      var etape:any=events.type
      console.log(events);
      this.loading.load=events.loaded;//Envoi instant
      this.loading.total=events.total;//Envoi Total
    this.pourc=this.loading.load*100/this.loading.total;//Calcule en %
    this.images=this.Selectedfile.name //Creer un tableau avec une image 
    },()=>{},()=>{
      this.fx.loadingFx(0)
      this.activeProgress=false;//Cacher progresse bar
    });
}

// Post Nouvelle article
async newArticle(title,price,devise,image)
{
  this.fx.loadingFx(1)
  this.http.get<any>(this.fx.server+'?newArticle&title='+title+'&price='+price+','+devise+'&image='+image).subscribe(reponse=>{    
    if (reponse.state==true){
      var col='primary'      
      // this.storage.set('profil',reponse.data)
      this.fx.dismiss()
     }else{ var col='danger'}
    this.fx.loadingFx(0)
    this.fx.toastMsg(reponse.message,col,2000)
  },error=>{
    this.fx.loadingFx(0)
    this.fx.toastMsg("Erreur de connexion","danger",2000)
  })

}
// Decaisse admin account  mannualy
motif
async decaisseFx(montant,motif){
  var load =await this.fx.loading.create({
    cssClass: 'loading',
    message:  "Loading",
    keyboardClose:true,
    id:"home"
  })
  await load.present()
  this.http.get<any>(this.fx.server+'?decharge&somme='+montant+'&motif='+motif).subscribe(reponse=>{    
    if (reponse.state==true){
      var col='primary'      
      this.motif=undefined
      this.montant=undefined
      this.update()
      this.journalDecharge=this.fx.journalDecharge
    }else{ var col='danger'}
    load.dismiss()
    this.fx.toastMsg(reponse.message,col,2000)
  },error=>{
    load.dismiss()
    this.fx.toastMsg("Erreur de connexion","danger",2000)
  })
}
delete(id){
  this.fx.loadingFx(1)
  this.http.get<any>(this.fx.server+'?deleteArticle='+id).subscribe(reponse=>{    
    if (reponse.state==true){
      var col='primary'      
      this.article=reponse.data
      this.storage.set('articles',reponse.data)
      this.update()
    }else{ var col='danger'}
    this.fx.loadingFx(0)
    this.fx.toastMsg(reponse.message,col,2000)
  },error=>{
    this.fx.loadingFx(0)
    this.fx.toastMsg("Erreur de connexion","danger",2000)
  })
}
  ngOnInit() {
  }

}
