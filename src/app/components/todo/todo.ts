import { Component, signal, WritableSignal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-todo',
  imports: [],
  templateUrl: './todo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './todo.css',
})
export class Todo {

  myInput: WritableSignal<string> = signal('');

  meuArray = signal([1, 2, 3, 4, 5]);

  addTodo() {
    const currentArray = this.meuArray();
    const nextValue = currentArray.length + 1;
    this.meuArray.set([...currentArray, nextValue]);
    this.myInput.set('');
  }

  removeTask(index: number) {
    const currentArray = this.meuArray();
    currentArray.splice(index, 1);
    this.meuArray.set([...currentArray]);
  }

}
