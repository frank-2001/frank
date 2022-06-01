import { Injectable } from '@angular/core';
import { ModalController, ToastController,AlertController,AlertButton,LoadingController} from '@ionic/angular';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { SignInPage } from './sign-in/sign-in.page';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {
  // server:any="https://instano.nunua-store.com/api-custum/index.php"
  // file="https://instano.nunua-store.com/api-custum/"
  file="http://localhost/Projects/Api-custum/"
  server:any="http://localhost/Projects/Api-custum/index.php"
  adrImg=this.file+'images/'
  abonnemenet=null
  load=null
  nbPanier=0
  profil:any
  constructor(public loading:LoadingController,public alert:AlertController,public router:Router,public http:HttpClient,public modalCtrl:ModalController,public toast:ToastController,public storage:Storage) {
    this.init()
    this.storage.get('panier').then(value=>{
      this.nbPanier=value.length
    })
    this.update()
    this.getContact()
   }
   getContact(){
    this.http.get<any>(this.server+'?contact').subscribe(
      reponse=>{
        this.storage.set('contact',reponse.data)
      },error=>{
        this.toastMsg('Echec de connexion','danger',2000)
      })
   }
   testNet(){
     //Cette fonction verifie la connexion internet et renvoie un message toast du resultat
     this.http.get(this.server).subscribe(
       reponse=>{
       },error=>{
         this.toastMsg('Echec de connexion','danger',2000)
       }
     )
   }
async chargement(cmd){
  if(cmd=='create'){
    this.load=await this.loading.create({
    cssClass: 'loading',
    message:"Chargement...",
    keyboardClose:true,
    id:"home"
  })
  await this.load.present()
}
if(cmd=='kill'){
  this.load=''
  // await this.load.present()
  await this.load.dismiss()
}
}
   // This code open page in a Modal,Input name of the page
  async openWin(page:any) {
    const modal = await this.modalCtrl.create({
      component: page,
      cssClass: 'my-custom-class',
      // componentProps: {
        //   'allart':this.tdata.allart,
      // }
    });
    return await modal.present();
  }
  // THIS FUNCTION CLOSE EVERY MODAL'S
  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  // Save Data in Storage DB @ionic/angular-storage
  // Input name of table data option : add or update
  saveStorage(index:any,data:any,option:string,state:string){
    this.init()
    var newData=[]
    if (option=='update') {
      this.storage.get(index).then(value=>{
          value.unshift(data)
        this.storage.set(index, value).then(()=>{
          if(state=='close'){
            this.dismiss()
          }
          })
        console.log("update");
      }).catch(()=>{
        this.storage.set(index,[data]).then(()=>{
          this.storage.get('upload').then(values=>{
            if(values!=null){
              values[1].state=0
              this.storage.set('upload',values)
            }
          })
          if(state=='close'){
            this.dismiss()
          }
          })
        console.log("add");
        })

    }
    else{
      this.storage.set(index,data).then(()=>this.dismiss())
      console.log("add");
      // this.storage.get('upload').then(values=>{
      //   if(values!=null){
      //     values[1].state=0
      //     this.storage.set('upload',values)
      //   }
      // })
    } 
  }
  // Get Data by storage DB
  getStorage(index){
    this.init()
    this.storage.get(index).then(val=>{
      return val
    }).catch(err=>{
      return
    })
  }
  // THIS FUNCTION SHOW TOAST MESSAGE
  async toastMsg(message:any,color:string,duration:number){
    const toast = await this.toast.create({
      message:message,
      duration: duration,
      position: "top",
      color: color,
    });
    toast.present();      
  }  
// Account verificator
  connect(){
    this.storage.get('profil').then(value=>{
      if(value==null){
        this.toastMsg('Veuiller vous conneter svp','warning',2000)
        this.openWin(SignInPage)
      }
    }).catch(err=>{
    })

}
//Auto updata Admin each 60 munites
nbCmd:number=0
notifNb:number=0
update(){
  this.getJournal()
  this.getCustums()
  this.storage.get('profil').then(value=>{
    if (value!=undefined){
      var id
        if(value[0].admin=='1'){ id=0 }else{id=value[0].id}
        this.caller(id,value)
        setInterval(()=>{
          this.caller(id,value)
        },3000)
    }
  })
}
rechargeNotif
caller(id:number,value){
  this.http.get<any>(this.server+'?getCmd&id='+id).subscribe(reponse=>{
    console.log(reponse);
    this.nbCmd=reponse.data.filter(el=>el.state==0).length            
  },err=>{
    this.storage.get('journal').then(value=>{
      this.nbCmd=value.filter(el=>el.state==0).length            
    })
  })

  this.http.get<any>(this.server+'?notif='+value[0].id).subscribe(reponse=>{
    let notif=reponse.data
    this.rechargeNotif=notif
    this.notifNb=notif.filter(el=>el.state==0).length
  },err=>{
    this.storage.get('notification').then(value=>{
      let notif=value
      this.rechargeNotif=notif
      this.notifNb=notif.filter(el=>el.state==0).length
    })
  })
}
// Ouvrir une page
openPage(page:any,data:any){
      this.router.navigate([page],{queryParams:{data}});
}
toastHttp(reponse,time:number){
  if (reponse.state==true) {
    this.toastMsg(reponse.message,'primary',time)
    this.dismiss
  }
  if (reponse.state==false) {
    this.toastMsg(reponse.message,'danger',time)
  }
}

// Animation chargement page
myload
async loadingFx(state,msg:string="Chargement..."){
    if (state==1) {
      this.myload =await this.loading.create({
        cssClass: 'loading',
        message:  msg,
        keyboardClose:true,
        id:"home"
      })
      await this.myload.present()
    } else {
      this.myload.dismiss()
    }
}
journalDecharge
getJournal(){
  this.http.get<any>(this.server+'?decharge&getJournal').subscribe(reponse=>{
    this.journalDecharge=reponse.data  
    this.storage.set('JournalDecharge',this.journalDecharge) 
    console.log(this.journalDecharge);
  },err=>{
    this.storage.get('JournalDecharge').then(value=>{
      this.journalDecharge=value           
    })
  })
}
// Get list custums
listCustums
getCustums(){
  this.http.get<any>(this.server+'?listCustums').subscribe(reponse=>{
    this.listCustums=reponse.data  
    this.storage.set('listCustums',this.listCustums) 
    console.log(this.listCustums);
  },err=>{
    this.storage.get('listCustums').then(value=>{
      this.listCustums=value           
    })
  })
}
  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
  }
}

