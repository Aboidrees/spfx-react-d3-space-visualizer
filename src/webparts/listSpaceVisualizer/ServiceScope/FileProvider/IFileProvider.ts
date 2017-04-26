/**
 * This interface allows unit tests to simulate the system clock.
 */
export interface IFileProvider {
  /**
   * Returns the current date/time.
   */
  getDate(): Date;

}
