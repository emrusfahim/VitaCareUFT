import * as fs from 'fs';
import * as path from 'path';
import { LoginData, ProfileData } from './DataTypes';

export class JsonDataReader {
  private static readJsonFile<T>(filePath: string): T {
    try {
      const fullPath = path.resolve(filePath);
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      return JSON.parse(fileContent) as T;
    } catch (error) {
      throw new Error(`Error reading JSON file: ${filePath}. ${error}`);
    }
  }

  public static getLoginData(): LoginData {
    return this.readJsonFile<LoginData>('./testdata/login-data.json');
  }

  // Keep this method for backward compatibility
  public static getValidLoginData(): LoginData {
    return this.getLoginData();
  }

  public static getProfileData(): ProfileData {
    return this.readJsonFile<ProfileData>('./testdata/profile-data.json');
  }
}