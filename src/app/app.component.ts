import { Component, OnInit } from '@angular/core';
import { MockOptions } from './mocks';
import { FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  name = 'Angular';

  availableOption = { ...MockOptions };
  availableName = Object.keys(this.availableOption);
  availableForm = new FormGroup({});
  selected;
  selectedForm = new FormGroup({});

  ngOnInit() {
    // Available
    const groupControls = this.availableName
    .reduce((group, name) => {
      group[name] = new FormArray(
        this.makeArrayControls(this.availableOption[name], true));
      return group;
    }, {});
    this.availableForm = new FormGroup(groupControls);
    this.initSelectedForm();
    this.setSelected();
  }

  private makeArrayControls(options, defaultValue) {
    return options.map(option => new FormControl(defaultValue));
  }

  private initSelectedForm() {
    const groupControls = this.availableName.reduce((group, name, ix) => {
      group[name] = new FormArray(this.makeArrayControls(this.availableOption[name], { value: false, disabled: true }));
      return group
    }, {});
    this.selectedForm = new FormGroup(groupControls);
  }

  setSelected() {
    this.selected = {...this.getSelected};
    Object.keys(this.selected).forEach(key => {
      (this.selectedForm.get(key) as FormArray).controls.forEach((control, idx) => {
        control.setValue(this.selected[key].some(x => x === this.availableOption[key][idx].Name))
      })
    })
  }

  // mapping the ckeckbox value to option name
  get getSelected() {    
    return this.availableName.reduce((selectedItem, name) => {
      selectedItem[name] = this.availableForm.value[name]
        .reduce((selectedOptions, selectItem, idx) => {
          if (selectItem) {
            selectedOptions.push(this.availableOption[name][idx].Name)
          }
          return selectedOptions;
        }, []);
      return selectedItem;
    }, {});
  }
}

