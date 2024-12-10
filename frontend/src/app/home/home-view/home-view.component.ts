import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { Profile } from '../../models/ProfileModel';
import { DeskApiService } from '../../services/desk-api.service';
import { response } from 'express';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent implements OnInit {
  constructor(
    private homeService: HomeService,
    private apiDeskService: DeskApiService,
    private loginService: LoginService
  ) {
    this.getDeskPosition();
  }

  profileid: string = '';
  curDeskHeight: number = 68;
  height: number = 68;
  profileTitle: string = '';
  hours: number = 0;
  minutes: number = 0;
  profiles: Profile[] = [];
  defaultProfiles: Profile[] = [];
  motivationLevel: string = '';
  isFormVisible: boolean = false;
  hoursStanding: number = 0;
  minutesStanding: number = 0;
  isStanding: boolean = false;
  curProfile!: Profile;
  sittingTimer: any;
  standingTimer: any;
  editMode!: boolean;

  private intervalId: any;
  private holdTime: number = 200;

  ngOnInit(): void {
    // Loads the profiles stored in the db
    this.homeService.getAllProfiles().subscribe({
      next: (response: Profile[]) => {
        console.log('Profiles loaded successfully:', this.homeService.profiles);
        this.defaultProfiles = this.homeService.defaultProfiles;
        this.profiles = this.homeService.profiles;
      },
      error: (error) => {
        console.error('Error loading profiles:', error);
      },
    });

    this.hours = this.homeService.hours;
    this.minutes = this.homeService.minutes;
    this.hoursStanding = this.homeService.hoursStanding;
    this.minutesStanding = this.homeService.minutesStanding;
    this.motivationLevel = this.homeService.motivationLevel;
  }

  getDeskPosition() {
    this.apiDeskService.getDeskPosition().subscribe({
      next: (response) => {
        this.curDeskHeight = response;
      },
      error: (error) => {
        console.error('Failed to get desk position:', error);
      },
    });
  }

  /* DESK HEIGHT CONTROL BUTTON */

  async updateDeskHeight(newHeight: number) {
    //makes it so the desk height is not for example 68.00000000000001
    newHeight = parseFloat(newHeight.toFixed(1));
    this.curDeskHeight = newHeight;
    console.log('Desk height:', newHeight); // Debugging line

    await this.apiDeskService.updateDeskPosition(newHeight).subscribe({
      next: (response) => {
        console.log('Desk position updated successfully:', response);
        // checks if the user is standing and updates the variable
        this.apiDeskService.isUserStanding().subscribe((isUserStanding) => {
          this.isStanding = isUserStanding;
          this.homeService.updateAnalytics(this.isStanding);
          console.log('Is user standing:', isUserStanding);
        });
      },
      error: (error) => {
        console.error('Failed to update desk position:', error);
      },
    });
  }

  increaseHeight() {
    if (this.curDeskHeight < 132) {
      this.curDeskHeight += 0.1;
      this.updateDeskHeight(this.curDeskHeight);
    }
  }

  decreaseHeight() {
    if (this.curDeskHeight > 68) {
      this.curDeskHeight -= 0.1;
      this.updateDeskHeight(this.curDeskHeight);
    }
  }

  onHoldIncrease() {
    this.clearInterval();
    this.holdTime = 75;

    this.intervalId = setInterval(() => {
      this.increaseHeight();
      this.holdTime = Math.max(20, this.holdTime - 20);
      this.clearAndRestartInterval(() => this.onHoldIncrease());
    }, this.holdTime);
    this.updateDeskHeight(this.curDeskHeight);
  }

  onHoldDecrease() {
    this.clearInterval();
    this.holdTime = 75;

    this.intervalId = setInterval(() => {
      this.decreaseHeight();
      this.holdTime = Math.max(20, this.holdTime - 20);
      this.clearAndRestartInterval(() => this.onHoldDecrease());
    }, this.holdTime);
    this.updateDeskHeight(this.curDeskHeight);
  }

  clearAndRestartInterval(callback: () => void) {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(callback, this.holdTime);
  }

  clearInterval() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /* PROFILE FORM CONTROL */

  profilePopUp() {
    this.isFormVisible = !this.isFormVisible;
  }

  validateHours() {
    this.homeService.validateHours(this.hours);
    this.homeService.validateHours(this.hoursStanding);
  }

  validateMinutes() {
    this.homeService.validateMinutes(this.minutes);
    this.homeService.validateMinutes(this.minutesStanding);
  }

  isFormValid(): boolean {
    //checks if its a default profile
    if (
      this.hours === 0 &&
      this.minutes === 0 &&
      this.hoursStanding === 0 &&
      this.minutesStanding === 0
    ) {
      return true;
    }
    // ensures timed profiles have a standing time and a sitting time
    if (
      this.hoursStanding === 0 &&
      this.minutesStanding === 0 &&
      (this.hours !== 0 || this.minutes !== 0)
    ) {
      alert('Please enter all fields');
      return false;
    }
    return true;
  }

  saveButtonHandler() {
    if(!this.editMode) {
      this.saveProfile();
    }
  }

  /* CRUD PROFILE LOGIC */

  saveProfile() {
    if (this.isFormValid()) {
      const newProfile = this.createProfile();
      if (this.checkForDuplicateProfile(newProfile)) {
        alert('Profile already exists');
        return;
      }
      if (this.homeService.isDefaultProfile(newProfile)) {
        this.homeService.defaultProfiles.push(newProfile);
      } else {
        this.homeService.profiles.push(newProfile);
      }

      this.clearForm();
      this.isFormVisible = false;
    }
  }

  createProfile(): Profile {
    const userid = this.loginService.getUserId();
    if (userid) {
      const { timerStanding, timerSitting } = this.getTimersString();

      if (this.profileTitle === '') {
        this.profileTitle = 'No Title';
      }
      const newProfile: Profile = {
        userId: userid,
        title: this.profileTitle,
        deskHeight: this.height,
        timer_sitting: timerSitting,
        timer_standing: timerStanding,
      };
      console.log('Creating profile...');
      this.homeService
        .createProfile(
          newProfile.userId,
          newProfile.title,
          newProfile.deskHeight,
          newProfile.timer_sitting ?? '',
          newProfile.timer_standing ?? ''
        )
        .subscribe({
          next: (response) => {
            newProfile.profileid = response.profileid;
            console.log('Profile created successfully:', response);
          },
          error: (error) => {
            console.error('Error creating profile:', error);
          },
        });
      return newProfile;
    } else {
      alert('You are not logged in.');
      throw new Error('User is not logged in');
    }
  }

  checkForDuplicateProfile(newProfile: Profile): boolean {
    return this.profiles
      .concat(this.defaultProfiles)
      .some(
        (profile) =>
          profile.userId === newProfile.userId &&
          profile.title === newProfile.title &&
          profile.deskHeight === newProfile.deskHeight &&
          profile.timer_sitting === newProfile.timer_sitting &&
          profile.timer_standing === newProfile.timer_standing
      );
  }

  editProfile(id: number, list: 'default' | 'timed') {
    let profile: Profile | undefined;

    if (list === 'default') {
      profile = this.defaultProfiles[id];
    } else if (list === 'timed') {
      profile = this.profiles[id];
    }

    if (!profile) {
      console.error('Profile not found');
      return;
    }

    // Update the form with the profile values and show it
    this.editMode = true;
    this.updateForm(profile);
    this.profilePopUp();

    console.log('Attempting to edit profile:', profile);
    this.homeService
      .updateProfile(
        Number(this.profileid),
        profile.userId,
        profile.title,
        profile.deskHeight,
        profile.timer_sitting ?? '',
        profile.timer_standing ?? ''
      )
      .subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          const index = this.profiles.findIndex(
            (profile) => profile.profileid === Number(this.profileid)
          );
          if (index !== -1) {
            this.profiles[index] = {
              ...profile,
              profileid: Number(this.profileid),
            };
          }
          this.clearForm();
          this.isFormVisible = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        },
      });
  }

  clearForm() {
    this.profileid = '';
    this.profileTitle = '';
    this.height = 68;
    this.hours = 0;
    this.minutes = 0;
    this.hoursStanding = 0;
    this.minutesStanding = 0;
    this.editMode = false;
  }

  updateForm(profile: Profile) {
    this.profileid = profile.profileid?.toString() || '';
    this.profileTitle = profile.title;
    this.height = profile.deskHeight;
    const {hours, minutes } = this.homeService.calcHrsMins(profile.timer_sitting ?? '');
    this.hours = hours;
    this.minutes = minutes;
    const {hours: hoursStanding, minutes: minuteStanding} = this.homeService.calcHrsMins(profile.timer_standing ?? '');    
    this.hoursStanding = hoursStanding;
    this.minutesStanding = minuteStanding;
  }

  async deleteProfile(index: number, list: 'default' | 'timed') {
    if (list === 'timed') {
      this.removeProfile(index, this.profiles);
    } else if (list === 'default') {
      this.removeProfile(index, this.defaultProfiles);
    } else {
      alert('Error removing profile');
      console.error('Error removing profile');
    }
  }

  async removeProfile(index: number, array: Profile[]) {
    const profileid = array[index].profileid;
    console.log('Profile ID:', profileid);
    if (profileid !== undefined) {
      await this.homeService.deleteProfile(profileid).subscribe({
        next: () => {
          array.splice(index, 1);
        },
        error: (error) => console.error('Error deleting profile:', error),
      });
    } else {
      console.error('Profile ID is undefined');
    }
  }

  getTimersString(): {timerStanding: string, timerSitting: string} {
    const timerSitting = `${this.hours}h ${this.minutes}m`;
    const timerStanding = `${this.hoursStanding}h ${this.minutesStanding}m`;
    return {timerStanding, timerSitting};
  }


  /* PROFILE SELECTION / TIMERS */

  profileSelected(profile: Profile) {
    console.log('Profile selected:', profile.title);
    this.curProfile = profile;
    //saved in local storage for now
    localStorage.setItem('profile', JSON.stringify(this.curProfile));

    // Remove 'selected' class from all profiles
    this.defaultProfiles.forEach((p) => (p.selected = false));
    this.profiles.forEach((p) => (p.selected = false));

    // Add 'selected' class to the current profile
    profile.selected = true;

    if (this.defaultProfiles.includes(profile)) {
      // Move the desk to the position of the default profile
      this.updateDeskHeight(profile.deskHeight);
      console.log('Moved desk to default profile height:', profile.deskHeight);

      // Stop any running timers
      this.stopTimers();
    } else {
      // Start the appropriate timer based on the current state
      if (this.isStanding) {
        this.startSittingTimer();
      } else {
        this.startStandingTimer();
      }
    }
  }

  stopTimers() {
    // Clear any existing timers
    if (this.sittingTimer) {
      clearTimeout(this.sittingTimer);
      this.sittingTimer = null;
      console.log('Stopped sitting timer');
    }
    if (this.standingTimer) {
      clearTimeout(this.standingTimer);
      this.standingTimer = null;
      console.log('Stopped standing timer');
    }
  }

  startSittingTimer() {
    try {
      this.isStanding = false;
      const { hours, minutes } = this.homeService.calcHrsMins(
        this.curProfile.timer_sitting ?? ''
      );
      const timerSitting = (hours * 60 + minutes) * 60 * 1000;

      console.log('Starting sitting timer:', timerSitting);
      this.sittingTimer = setTimeout(() => {
        const standingProfile = this.curProfile;
        this.updateDeskHeight(standingProfile.deskHeight);
        console.log('Updated desk height:', standingProfile.deskHeight);
        this.profileSelected(this.curProfile);
      }, timerSitting);
    } catch (error) {
      alert('Error starting sitting timer');
      console.error('Error starting sitting timer:', error);
    }
  }

  startStandingTimer() {
    try {
      this.isStanding = true;
      const { hours, minutes } = this.homeService.calcHrsMins(
        this.curProfile.timer_standing ?? ''
      );
      const timerStanding = (hours * 60 + minutes) * 60 * 1000;
      console.log('Starting standing timer:', timerStanding);
      // calls the updateDeskHeight function after timer is over
      this.standingTimer = setTimeout(() => {
        const sittingProfile = this.defaultProfiles[0];
        this.updateDeskHeight(sittingProfile.deskHeight);
        this.profileSelected(this.curProfile);
      }, timerStanding);
    } catch (error) {
      alert('Error starting standing timer');
      console.error('Error starting standing timer:', error);
    }
  }
}
