/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface AuthResponse {
  /**
   * The JWT to return in future responses
   */
  jwt?: string;
  /**
   * The URL of the default picture, if get_picture_urls was sent in the request
   */
  default_picture_url?: string;
  /**
   * The keywords of the user pictures, if get_picture_keywords was sent in the request.  Picture keywords are used to identify which userpic (100x100 icon) to use for that particular post. For instance, the user may have 'Angry', 'Happy', and 'Sleepy' picture keywords which map to certain pictures. The client should also do a case-insensitive compare on this list when a mood is selected or entered, and auto-select the current picture keyword. That way it seems that selecting a mood also sets their corresponding picture
   */
  picture_keywords?: string[];
  /**
   * The URLs of the user pictures, if get_picture_urls was sent in the request. They correspond with the list of picture keywords returned. Note that the content behind these URLs can never change, so if your client downloads these to display, just cache them locally and never hit the servers again to re-download them or to even check if they've been modified
   */
  picture_urls?: string[];
  /**
   * List of available friend groups
   */
  friend_groups?: FriendGroup[];
  /**
   * List of journals (user, community, news) this user has permission to post in
   */
  journals?: string[];
  /**
   * List of available moods, if get_moods was set to true in the auth request.  The contents are the new moods that have been added on the server since you last requested the list. Your client should cache the mood list on the client's computer to avoid requesting the whole list every time
   */
  moods?: Mood[];
  /**
   * Error message(s), if failed
   */
  errors?: string[];
  [k: string]: any;
}
export interface FriendGroup {
  /**
   * The bit number of this friend group, from 1-30
   */
  id: number;
  /**
   * Name of this friend group
   */
  name: string;
  /**
   * The sort order of this friend group, from 0-255
   */
  sortorder: number;
  /**
   * If this friend group is public
   */
  public: boolean;
  [k: string]: any;
}
export interface Mood {
  /**
   * The ID of this mood
   */
  id: number;
  /**
   * Name of this mood
   */
  name: string;
  /**
   * The parent mood ID for this mood
   */
  parent: number;
  [k: string]: any;
}
