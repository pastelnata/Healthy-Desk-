import { Injectable } from '@angular/core';
import { UserScore } from '../models/user-score';
@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  userScore: UserScore[] = [{
    id: 1,
    name: 'user1',
    score: 19
  },
  {id: 2,
    name: 'user2',
    score: 20
  },
  {id: 3,
    name: 'Tomasz',
    score: 21
  },
  {id: 4,   
    name: 'testUser',
    score: 22
  },
  {id: 5,   
    name: 'Robert',
    score: 23
  },
  ];
  
  constructor() { }

  getUserScore(): UserScore[] {
    return this.userScore;
  }



}
