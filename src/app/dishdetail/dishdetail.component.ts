import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder , FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';

import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators'

import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations:[
    trigger('visibility', [
      state('shown', style({
        transform: 'scale(1.0)',
        opacity : 1
      })),
      state('hidden', style(
        {
          transform: 'scale(0.5)',
          opacity : 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishdetailComponent implements OnInit {

  // @Input() no longer need it, since it wont be received as input
  dish: Dish;
  errMess:string;
  dishIds: string[];
  prev: string;
  next: string;
  
  commentForm: FormGroup;
  comment:Comment;
  @ViewChild('cform') commentFormDirective;

  dishcopy: Dish;
  visibility ='shown';


  formErrors = {
    'comment' : 'nancyC',
    'author' : 'nancyA',
  };
  validationsMessages = {
    'comment'  : {
      'required' :'Comment is required',
      'minlength' :'A comment must be at least 2 characters long'
    },
    'author' : {
      'required' :'Author Name is required',
      'minlength' :'Name must be at least 2 characters long',
      'maxlength' : 'Name cannot be more than 25 characters long'
    },
  };

  constructor( private fb:FormBuilder, private dishService: DishService, private location: Location,
    private route: ActivatedRoute, @Inject('BaseURL') private BaseURL) { 
      this.createCommentForm();
    }
  
  ngOnInit() {
    this.dishService.getDishIds()
    .subscribe((dishIds) => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params:Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
    .subscribe(      (dish) => {
                                  this.visibility = 'shown';
                                  this.dish = dish;
                                  this.dishcopy = dish;
                                  this.setPrevNext(dish.id);
                                },
                      (errmess) => this.errMess = <any>errmess );
  }

  // **************************** ALL ABOUT PREV AND NEXT ITEM ****************************

  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }


// **************************** ALL ABOUT THE COMMENT FORM ****************************

  createCommentForm():void{
    this.commentForm = this.fb.group({
        rating: ['', Validators.required],
        comment: ['', Validators.required],
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
        date: '',
    });
    // TODO: validation goes here /`v
    this.commentForm.valueChanges
    .subscribe( data => this.onValueChanged(data) );
    this.onValueChanged(); // (re)set form validations messages

  }

  onValueChanged(data?: any){
    if(!this.commentForm){ return;}
    const form = this.commentForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        // clear previous error message (if any)
        this.formErrors[field] = ''
        const control = form.get(field);
        if (control && control.dirty && !control.valid){
          const messages = this.validationsMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish => {
      this.dish = dish;
      this.dishcopy = dish;
    },
    errmess => {this.dish = null;
                this.dishcopy=null;
                this.errMess= <any>errmess
              });
    console.log(this.comment);
    this.commentForm.reset({
                              rating: '',
                              comment: '',
                              author: '',
                              date: '',
                            });
    this.commentFormDirective.resetForm();

  }
}
