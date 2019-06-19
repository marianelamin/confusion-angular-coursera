import { trigger, state, style, animate, transition } from '@angular/animations';
import { Transform } from 'stream';

export function visibility() {
    //this is a factory function
   return trigger('visibility', [
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
      ]);
}

export function flyInOut(){
    return trigger('flyInOut',[
        state('*', style({
            opacity:1,
            transform:'translateX(0)'
        })),
        transition(':enter', [
            style({
                transform: 'translateX(-100%)',
                opacity: 0
            }),
            animate(500) // '500ms ease-in'
            ]
        ), // from any void into a new
        transition(':leave', [
            animate('500ms ease-out', style({
                transform: 'translateX(-100%)',
                opacity:0
            }))
        ])
    ])
}

export function expand(){
    return trigger('expand',[
        state('*', style({
            opacity:1,
            transform: 'translateX(0)'

        })),
        transition(':enter',[
            style({
                transform: 'translateY(-50%)',
                opacity:0
            }),
            animate('200ms ease-in', style({
                opacity:1,
                transform: 'translate(0)',
            }

            ))
        ])
    ]);
}