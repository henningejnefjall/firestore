import { Component } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Post {
  title: string;
  content: string;
}

interface PostId extends Post {
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  postsCol: AngularFirestoreCollection<Post>;
  posts: any; //Observable<Post[]>;
  
  title:string;
  content:string;

  postDoc: AngularFirestoreDocument<Post>;
  post: Observable<Post>;

  constructor(private afs:AngularFirestore){

  }

  ngOnInit(){
     this.postsCol = this.afs.collection('myposts');
    //this.postsCol = this.afs.collection('myposts', ref => ref.where('title',"==", "omfg")); //where alternativ, orderby, limit etc.
    // this.posts = this.postsCol.valueChanges();
    this.posts = this.postsCol.snapshotChanges() //innehåller metadata ex. id
      .map(actions => {
        return actions.map(a=>{
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.id;
          return {id, data};
        })
      })
  }

  addPost(){
    // this.afs.collection('myposts').add({'title' : this.title, 'content':this.content});
    this.afs.collection('myposts').doc('my-custom-id').set({'title' : this.title, 'content':this.content});
  }

  getPost(postId){
    this.postDoc = this.afs.doc('myposts/'+postId);
    this.post = this.postDoc.valueChanges();
  }

  deletePost(postId){
    this.afs.doc('myposts/'+postId).delete();
  }
}
