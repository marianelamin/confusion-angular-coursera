import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
// import { DISHES } from '../shared/dishes';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  dishes: Dish[];
  
  selectedDish : Dish;


  constructor(private dishService: DishService) { }

  ngOnInit() {
    this.dishService.getDishes()
    .subscribe((dishes)=> { this.dishes = dishes; });
    // console.log('I got your data');
  }

  onSelect(tdish : Dish){
    this.selectedDish = tdish;
    // console.log(this.selectedDish);
  }

}
