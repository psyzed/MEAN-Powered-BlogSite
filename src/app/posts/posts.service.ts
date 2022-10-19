import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  // posts: { title: string; content: string }[] = [
  //   { title: 'First Post', content: 'This is the first post!' },
  //   { title: 'Second Post', content: 'This is the second post!' },
  //   { title: 'Third Post', content: 'This is the third post!' },
  // ];

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      post: {
        _id: string;
        title: string;
        content: string;
      };
      message: string;
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(post: Post) {
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        const postId = responseData.postId;
        post.id = postId;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(post: Post) {
    const updatedPost: Post = {
      id: post.id,
      title: post.title,
      content: post.content,
    };
    this.http
      .put('http://localhost:3000/api/posts/' + updatedPost.id, updatedPost)
      .subscribe((responseData) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(
          (post) => post.id === updatedPost.id
        );
        updatedPosts[oldPostIndex] = updatedPost;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPostsArray = this.posts.filter(
          (post) => post.id !== postId
        );
        this.posts = updatedPostsArray;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
