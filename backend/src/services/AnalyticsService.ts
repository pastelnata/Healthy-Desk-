import Day from "../models/DayModel";

export class AnalyticsService {
  static async createDay(
    userid: number,
    date: Date,
    times_moved: number,
    standing_hrs: number,
  ) {
    const existingDay = await Day.findOne({
      where: {
        date: date,
        userid: userid,
      },
    });
    if (existingDay) {
      //if the day already exists, it updates it.
      this.updateDay(existingDay, standing_hrs, times_moved);
      return existingDay;
    }
    try {
      console.log("Creating day..", date);
      const newDay = await Day.create({
        userid: userid,
        date: date,
        times_moved: times_moved,
        standing_hrs: Math.round(standing_hrs),
      });
      console.log("Day created successfully");
      return newDay;
    } catch (error) {
      console.error("Error creating day:", error);
      throw error;
    }
  }

  static async updateDay(
    existingDay: Day,
    addedHrs: number,
    addedTimesMoved: number,
  ): Promise<Day> {
    try {
      console.log("Updating day..", existingDay);
      existingDay.update({
        standing_hrs: Math.round(existingDay.getStandingHrs() + addedHrs),
        times_moved: Math.round(existingDay.getTimesMoved() + addedTimesMoved),
      });
      console.log("Day updated successfully");
      return existingDay;
    } catch (error) {
      console.error("Error updating day:", error);
      throw error;
    }
  }
}

export default AnalyticsService;
