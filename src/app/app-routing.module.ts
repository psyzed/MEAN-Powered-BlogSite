import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CreatePostsComponent } from './posts/create-posts/create-posts.component';

import { PostsListComponent } from './posts/posts-list/posts-list.component';

const routes: Routes = [
  { path: '', component: PostsListComponent },
  { path: 'create', component: CreatePostsComponent },
  { path: 'edit/:postId', component: CreatePostsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
