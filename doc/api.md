# **1. User Api**
--------

## **Signin**

**URL:** [api/session](api/session)

**Method: POST**

**Param request:**

  * `email`, type: string, presence: true
  * `password`, type: string, presence: true

**Request example:**

  * `POST: {"user": {"email": "tran.tien.thanh@framgia.com", "password": "12345678"}}`

**Response:** (Return json with user's information if success else return json with error message)

  * SUCCESS:

    `{"message": "Login Success!", "user": {"id": 6: {"id": 6, "name": "Tran Tien Thanh", "email":"tran.tien.thanh@framgia.com", "avatar": null, "chatwork_id": null, "token": null, "uid": null, "provider": null, "expires_at": null, "refresh_token": null, "email_require": false, "created_at": "2016-07-15T11:05:11.000Z", "updated_at": "2016-07-21T02:06:59.809Z", "auth_token": "_FTuFJ_88PCTM4Bxb-mL"}}`

  * FAILS:

    `{"error": "Invalid email or password"}`

## **Sign out**

**URL:** [api/session/id](api/session/id)

**Method: DELETE**

**Param request:**

  * `auth_token`, type: string, presence: true

**Response:**

  * SUCCESS:

    `{"message":"Sign out success!"}`

  * FAILS:

    `{"error": "Sign out failed!"}`

# **2. Event Api**
---------

## **List Event**

**URL:** [api/events](api/events)

**Method: GET**

**Param request:**

  * `auth_token`, type: string, presence: true
  * `calendars`, type: string

**Response:**

  * SUCCESS:

    `{"message": "Request Success!", "events": [{"id": "Ibxsmxz7pw0y3Sce8DIXsw", "title": "Framgia CRB", "start_date": "2016-07-26 00:00", "finish_date": "2016-07-26 23:59", "start_repeat": "2016-07-26", "end_repeat": "2016-07-27", "color_id": 3, "calendar": "Tran Tien Thanh", "all_day": true, "repeat_type": "daily", "exception_type": null, "event_id": 119, "exception_time": null, "editable": true, "persisted": true}, { "id": "rNx28b2ShoMCbKACl7f5gw", "title": "Framgia CRB", "start_date": "2016-07-27 00:00", "finish_date": "2016-07-27 23:59", "start_repeat": "2016-07-27", "end_repeat": "2016-07-27", "color_id": 3, "calendar": "Tran Tien Thanh", "all_day": true, "repeat_type": "daily", "exception_type": null, "event_id": 119, "exception_time": null, "editable": true, "persisted": false}]}`

  * FAILS:

    `{"error": "Invalid Params"}`

## **Show Detail Event**

**URL:** [api/events/id.json](api/events/id.json)

**METHOD: GET**

**Param Request:**

  * `auth_token`, type: string, presence: true

**Response:**

  * SUCCESS:

    `{"message": "Show Detail Event Success!",
      "event": {
        "id": 154,
        "title": "abc",
        "description": "",
        "status": null,
        "color": null,
        "all_day": true,
        "repeat_type": "daily",
        "repeat_every": 1,
        "user_id": 6,
        "calendar_id": 6,
        "start_date": "2016-07-28T00:00:00.000Z",
        "finish_date": "2016-07-28T23:59:00.000Z",
        "start_repeat": "2016-07-28T00:00:00.000Z",
        "end_repeat": "2016-07-31T00:00:00.000Z",
        "exception_time": null,
        "exception_type": null,
        "old_exception_type": null,
        "parent_id": null,
        "place_id": 37,
        "chatwork_room_id": null,
        "task_content": null,
        "message_content": null,
        "google_event_id": null,
        "google_calendar_id": null,
        "created_at": "2016-07-28T06:04:17.000Z",
        "updated_at": "2016-07-28T06:04:17.000Z",
        "deleted_at": null,
        "attendees": [
          {
            "id": 1,
            "email": "hoang.thi.nhung@framgia.com",
            "user_id": 1,
            "event_id": 154,
            "created_at": "2016-07-28T06:04:17.000Z",
            "updated_at": "2016-07-28T06:04:17.000Z"
          }
        ],
        "repeat_ons": [],
        "days_of_weeks": [],
        "event_exceptions": [],
        "notification_events": [
          {
            "id": 1,
            "event_id": 154,
            "notification_id": 1,
            "created_at": "2016-07-28T06:04:17.000Z",
            "updated_at": "2016-07-28T06:04:17.000Z"
          }
        ],
        "notifications": [
          {
            "id": 1,
            "notification_type": "Email",
            "created_at": "2016-07-15T11:05:06.000Z",
            "updated_at": "2016-07-15T11:05:06.000Z"
          }
        ],
        "calendar": {
          "id": 6,
          "user_id": 6,
          "name": "Tran Tien Thanh",
          "description": null,
          "color_id": 10,
          "status": "no_public",
          "is_default": true,
          "created_at": "2016-07-15T11:05:11.000Z",
          "updated_at": "2016-07-15T11:05:11.000Z"
        },
        "owner": {
          "id": 6,
          "name": "Tran Tien Thanh",
          "email": "tran.tien.thanh@framgia.com",
          "avatar": null,
          "chatwork_id": null,
          "google_calendar_id": "82poim9ul05t12pg4cc0u0hnvo@group.calendar.google.com",
          "token": null,
          "uid": null,
          "provider": null,
          "expires_at": null,
          "refresh_token": null,
          "email_require": false,
          "created_at": "2016-07-15T11:05:11.000Z",
          "updated_at": "2016-07-28T06:05:16.000Z",
          "auth_token": "sR47PsJhhgPGRDo673hn"
        },
        "place": {
          "id": 37,
          "name": "Singapore",
          "address": null,
          "user_id": 6,
          "latitude": null,
          "longitude": null,
          "created_at": "2016-07-15T11:05:11.000Z",
          "updated_at": "2016-07-15T11:05:11.000Z"
        }
      }}`

  * FAILS:

    `{"error": "Not Authenticated!"}`


## **Create Event**

**URL:** [api/events.json](api/events.json)

**METHOD: POST**

**Params Request:**

  * `auth_token`, type: string
  * `event[:title]`, type: string, presence: true, length: {maximum: 255}
  * `event[:start_date]`, type: datetime, presence: true
  * `event[:finish_date]`, type: datetime, presence: true
  * `calendar_id`, type: interger

**Request example:**

  * `POST: {
    "auth_token": "sR47PsJhhgPGRDo673hn",
    "event": 
    {
      "title": "Framgia CRB",
      "start_date":"2016-07-17T00:00:00.000Z",
      "finish_date":"2016-07-17T01:00:00.000Z",
      "all_day":"1",
      "calendar_id":"6",
      "place_id":"37",
      "notification_events_attributes":
      {
        "0":
        {
          "notification_id":"1"
        }
      },
      "attendees_attributes":
      {
        "0":
        {
          "email":"hoang.thi.nhung@framgia.com",
          "user_id":"1"
        }
      },
      "repeat_type":"weekly",
      "repeat_every":"1",
      "start_repeat":"2016-07-17T00:00:00.000Z",
      "end_repeat":"2016-07-30T00:00:00.000Z",
      "repeat_ons_attributes":
      {
        "1":
        {
          "days_of_week_id":"2"
        },
        "2":
        {
          "days_of_week_id":"3"
        }
      },
      "repeat":"1"
      }
    }`

**Response:**

  * SUCCESS:

    `{"message": "Create Event Success!",
    "events": {
      "id": 174,
      "title": "Framgia CRB",
      "description": null,
      "status": null,
      "color": null,
      "all_day": true,
      "repeat_type": "weekly",
      "repeat_every": 1,
      "user_id": 6,
      "calendar_id": 6,
      "start_date": "2016-07-17T00:00:00.000Z",
      "finish_date": "2016-07-17T01:00:00.000Z",
      "start_repeat": "2016-07-17T00:00:00.000Z",
      "end_repeat": "2016-07-30T00:00:00.000Z",
      "exception_time": null,
      "exception_type": null,
      "old_exception_type": null,
      "parent_id": null,
      "place_id": 37,
      "chatwork_room_id": null,
      "task_content": null,
      "message_content": null,
      "google_event_id": null,
      "google_calendar_id": null,
      "created_at": "2016-07-28T09:25:35.760Z",
      "updated_at": "2016-07-28T09:25:35.760Z",
      "deleted_at": null,
      "attendees": [
        {
          "id": 7,
          "email": "hoang.thi.nhung@framgia.com",
          "user_id": 1,
          "event_id": 174,
          "created_at": "2016-07-28T09:25:35.764Z",
          "updated_at": "2016-07-28T09:25:35.764Z"
        }
      ],
      "repeat_ons": [
        {
          "id": 6,
          "event_id": 174,
          "days_of_week_id": 2,
          "created_at": "2016-07-28T09:25:35.766Z",
          "updated_at": "2016-07-28T09:25:35.766Z"
        },
        {
          "id": 7,
          "event_id": 174,
          "days_of_week_id": 3,
          "created_at": "2016-07-28T09:25:35.768Z",
          "updated_at": "2016-07-28T09:25:35.768Z"
        }
      ],
      "days_of_weeks": [
        {
          "id": 2,
          "name": "mo",
          "created_at": "2016-07-15T11:05:07.000Z",
          "updated_at": "2016-07-15T11:05:07.000Z"
        },
        {
          "id": 3,
          "name": "tu",
          "created_at": "2016-07-15T11:05:07.000Z",
          "updated_at": "2016-07-15T11:05:07.000Z"
        }
      ],
      "event_exceptions": [],
      "notification_events": [
        {
          "id": 6,
          "event_id": 174,
          "notification_id": 1,
          "created_at": "2016-07-28T09:25:35.000Z",
          "updated_at": "2016-07-28T09:25:35.000Z"
        }
      ],
      "notifications": [
        {
          "id": 1,
          "notification_type": "Email",
          "created_at": "2016-07-15T11:05:06.000Z",
          "updated_at": "2016-07-15T11:05:06.000Z"
        }
      ],
      "calendar": {
        "id": 6,
        "user_id": 6,
        "name": "Tran Tien Thanh",
        "description": null,
        "color_id": 10,
        "status": "no_public",
        "is_default": true,
        "created_at": "2016-07-15T11:05:11.000Z",
        "updated_at": "2016-07-15T11:05:11.000Z"
      },
      "owner": {
        "id": 6,
        "name": "Tran Tien Thanh",
        "email": "tran.tien.thanh@framgia.com",
        "avatar": null,
        "chatwork_id": null,
        "google_calendar_id": "82poim9ul05t12pg4cc0u0hnvo@group.calendar.google.com",
        "token": null,
        "uid": null,
        "provider": null,
        "expires_at": null,
        "refresh_token": null,
        "email_require": false,
        "created_at": "2016-07-15T11:05:11.000Z",
        "updated_at": "2016-07-28T06:05:16.000Z",
        "auth_token": "sR47PsJhhgPGRDo673hn"
      },
      "place": {
        "id": 37,
        "name": "Singapore",
        "address": null,
        "user_id": 6,
        "latitude": null,
        "longitude": null,
        "created_at": "2016-07-15T11:05:11.000Z",
        "updated_at": "2016-07-15T11:05:11.000Z"
      }
    }}`

  * EVENT OVERLAP:

    `{"message": "Event Overlap"}`

  * FAILS:

    `{"error": "Create Event Failed!"}`

**Note:**
  
  * **If Place don't have in database, we must add new params:**

    * `event[:place_id]`, default: -1
    * `name`, type: string

  * **If Attendee don't have in database, we must add new params:**

    * `event[:attendees_attributes]`, type:string

  * **Request Example:**

    `POST: {
      "auth_token": "sR47PsJhhgPGRDo673hn",
      "event": 
      {
        "title": "Framgia CRB",
        "start_date":"2016-07-17T00:00:00.000Z",
        "finish_date":"2016-07-17T01:00:00.000Z",
        "all_day":"1",
        "calendar_id":"6",
        "place_id":"-1",
        "attendees_attributes":
        {
          "0":
            {
              "email":"tran.quang.trung@framgia.com"
            }
          }
        },
        "name":"Paris"
      }`

  * **Response:**

    `{"message": "Create Event Success!",
      "events": {
        "id": 189,
        "title": "Framgia CRB",
        "description": null,
        "status": null,
        "color": null,
        "all_day": true,
        "repeat_type": null,
        "repeat_every": null,
        "user_id": 6,
        "calendar_id": 6,
        "start_date": "2016-07-17T00:00:00.000Z",
        "finish_date": "2016-07-17T01:00:00.000Z",
        "start_repeat": null,
        "end_repeat": null,
        "exception_time": null,
        "exception_type": null,
        "old_exception_type": null,
        "parent_id": null,
        "place_id": null,
        "chatwork_room_id": null,
        "task_content": null,
        "message_content": null,
        "google_event_id": null,
        "google_calendar_id": null,
        "created_at": "2016-07-28T10:51:53.906Z",
        "updated_at": "2016-07-28T10:51:53.906Z",
        "deleted_at": null,
        "attendees": [
          {
            "id": 12,
            "email": "tran.quang.trung@framgia.com",
            "user_id": 17,
            "event_id": 189,
            "created_at": "2016-07-28T10:51:53.909Z",
            "updated_at": "2016-07-28T10:51:53.909Z"
          }
        ],
        "repeat_ons": [],
        "days_of_weeks": [],
        "event_exceptions": [],
        "notification_events": [],
        "notifications": [],
        "calendar": {
          "id": 6,
          "user_id": 6,
          "name": "Tran Tien Thanh",
          "description": null,
          "color_id": 10,
          "status": "no_public",
          "is_default": true,
          "created_at": "2016-07-15T11:05:11.000Z",
          "updated_at": "2016-07-15T11:05:11.000Z"
        },
        "owner": {
          "id": 6,
          "name": "Tran Tien Thanh",
          "email": "tran.tien.thanh@framgia.com",
          "avatar": null,
          "chatwork_id": null,
          "google_calendar_id": "82poim9ul05t12pg4cc0u0hnvo@group.calendar.google.com",
          "token": null,
          "uid": null,
          "provider": null,
          "expires_at": null,
          "refresh_token": null,
          "email_require": false,
          "created_at": "2016-07-15T11:05:11.000Z",
          "updated_at": "2016-07-28T06:05:16.000Z",
          "auth_token": "sR47PsJhhgPGRDo673hn"
        },
        "place": {
          "id": 97,
          "name": "Paris",
          "address": null,
          "user_id": 6,
          "latitude": null,
          "longitude": null,
          "created_at": "2016-07-28T11:15:43.000Z",
          "updated_at": "2016-07-28T11:15:43.000Z"
        }
      }
    }}`

## **Update Event**

**URL:** [api/events/id](api/events/id)

**Method: PATCH**

**Param request:** (3 options: delete only, delete all follow, delete all)

  * `auth_token`, type: string, presence: true
  * `event[:title]`, type: string, presence: true, length: {maximum: 255}
  * `event[:start_date]`, type: datetime, presence: true
  * `event[:finish_date]`, type: datetime, presence: true
  * `event[:exception_type]`, type: string, option: edit-only/edit-all-follow/edit-all
  * `event[:end_repeat]`, type: datetime
  * `persisted`, type: interger
  * `start_time_before_drag`, type:datetime

**Request example:**
  
  * `PATCH: {"auth_token": "LThaQcMP5s_TBo_VgjWu", "event": {"title":"CRB","start_date":"2016-07-27T00:00:00.000Z", "finish_date":"2016-07-27T23:59:00.000Z", "exception_type":"edit_only", end_repeat": null}, "persisted":"0", "start_time_before_drag":null}`

**Response:**

  * SUCCESS:

    `{"message": "Event was updated successfully." {"id": 48, "title": "CRB", "description": null, "status": null, "color": null, "all_day": false, "repeat_type": null, "repeat_every": null, "user_id": 6, "calendar_id": null, "start_date": "2016-07-27T00:00:00.000Z", "finish_date": "2016-07-27T00:00:00.000Z", "start_repeat": null, "end_repeat": null, "exception_time": 2016-07-27T00:00:00.000Z", "exception_type": "edit_only", "old_exception_type": null, "parent_id": 47, "place_id": null, "chatwork_room_id": null, "task_content": null, "message_content": null, "google_event_id": null, "google_calendar_id": null, "created_at": "2016-07-27T02:46:42.997Z", "updated_at": "2016-07-27T02:46:42.997Z", "deleted_at": null, "attendees": [], "users": [], "repeat_ons": [], "days_of_weeks": [], "event_exceptions": [], "notification_events": [], "notifications": [] "calendar": null, "owner": {"id": 4, "name": "Nguyen Quang Duy", "email": "nguyen.quang.duy@framgia.com", "avatar": null, "chatwork_id": null, "google_calendar_id": "36poim9ul05t12pg4cc0u0hnvo@group.calendar.google.com", "token": null, "uid": null, "provider": null, "expires_at": null, "refresh_token": null, "email_require": false, "created_at": "2016-07-17T11:05:11.000Z", "updated_at": "2016-07-27T02:06:59.000Z", "auth_token": "UCdwirxutvkyHUS_b_CL"}, "event_parent": null, "place": null}}`

  * Event Overlap:

    `{"message": "Event not updated because overlap"}`

**Note:**
  
  * **If Place don't have in database, we must add new params:**

    * `event[:place_id]`, default: -1
    * `name`, type: string

  * **If Attendee don't have in database, we must add new params:**

    * `event[:attendees_attributes]`, type:string

  * **Request Example:**

    `PATCH: {
      "auth_token": "LThaQcMP5s_TBo_VgjWu",
      "event": 
      {
        "title": "Framgia CRB",
        "start_date":"2016-07-17T00:00:00.000Z",
        "finish_date":"2016-07-17T01:00:00.000Z",
        "exception_type":"edit_only",
        "place_id":"-1",
        "attendees_attributes":
        {
          "0":
            {
              "email":"tran.quang.trung@framgia.com"
            }
          }
        },
        "name":"Paris",
        "persisted":"0",
        "start_time_before_drag":null
      }`

  * **Response:**

    `{"message": "Create Event Success!",
      "events": {
        "id": 189,
        "title": "Framgia CRB",
        "description": null,
        "status": null,
        "color": null,
        "all_day": true,
        "repeat_type": null,
        "repeat_every": null,
        "user_id": 6,
        "calendar_id": 6,
        "start_date": "2016-07-17T00:00:00.000Z",
        "finish_date": "2016-07-17T01:00:00.000Z",
        "start_repeat": null,
        "end_repeat": null,
        "exception_time": null,
        "exception_type": null,
        "old_exception_type": null,
        "parent_id": null,
        "place_id": null,
        "chatwork_room_id": null,
        "task_content": null,
        "message_content": null,
        "google_event_id": null,
        "google_calendar_id": null,
        "created_at": "2016-07-28T10:51:53.906Z",
        "updated_at": "2016-07-28T10:51:53.906Z",
        "deleted_at": null,
        "attendees": [
          {
            "id": 12,
            "email": "tran.quang.trung@framgia.com",
            "user_id": 17,
            "event_id": 189,
            "created_at": "2016-07-28T10:51:53.909Z",
            "updated_at": "2016-07-28T10:51:53.909Z"
          }
        ],
        "repeat_ons": [],
        "days_of_weeks": [],
        "event_exceptions": [],
        "notification_events": [],
        "notifications": [],
        "calendar": {
          "id": 6,
          "user_id": 6,
          "name": "Tran Tien Thanh",
          "description": null,
          "color_id": 10,
          "status": "no_public",
          "is_default": true,
          "created_at": "2016-07-15T11:05:11.000Z",
          "updated_at": "2016-07-15T11:05:11.000Z"
        },
        "owner": {
          "id": 6,
          "name": "Tran Tien Thanh",
          "email": "tran.tien.thanh@framgia.com",
          "avatar": null,
          "chatwork_id": null,
          "google_calendar_id": "82poim9ul05t12pg4cc0u0hnvo@group.calendar.google.com",
          "token": null,
          "uid": null,
          "provider": null,
          "expires_at": null,
          "refresh_token": null,
          "email_require": false,
          "created_at": "2016-07-15T11:05:11.000Z",
          "updated_at": "2016-07-28T06:05:16.000Z",
          "auth_token": "sR47PsJhhgPGRDo673hn"
        },
        "place": {
          "id": 97,
          "name": "Paris",
          "address": null,
          "user_id": 6,
          "latitude": null,
          "longitude": null,
          "created_at": "2016-07-28T11:15:43.000Z",
          "updated_at": "2016-07-28T11:15:43.000Z"
        }
      }
    }}`


## **Delete Event**

**URL:** [api/events/id](api/events/id)

**MEthod: DELETE**

**Param request:** (3 options: delete only, delete all follow, delete all)

  * `auth_token`, type: string, presence: true
  * `exception_type`, type: string, options: delete-only/delete-all-follow/delete-all
  * `exception_time`, type: datetime
  * `start_date_before_delete`, type:datetime

**Request example:**

  * `DELETE: {"auth_token": "LThaQcMP5s_TBo_VgjWu", "exception_type": "delete_only", "exception_time": "2016-07-28T00:00:00.000Z", "start_date_before_delete": "2016-07-28T00:00:00.000Z"}`

**Response**

  * SUCCESS:

    `{"message": "Event deleted"}`

  * FAILS:

    `{}`

# **3. Search Api**
---------

## **Search Attendee**

**URL:** [api/search](api/search)

**Method: GET**

**Param request:**

  * `term`, type: string

**Request example:**

  * `GET: {"term": "t"}`

**Response:** 

  `[{"email":"chu.anh.tuan@framgia.com","user_id":3},{"email":"hoang.thi.nhung@framgia.com","user_id":1},{"email":"le.thi.thuy@framgia.com","user_id":10},{"email":"nguyen.thi.phuong@framgia.com","user_id":5},{"email":"nguyen.van.thieub@framgia.com","user_id":13},{"email":"tran.tien.thanh@framgia.com","user_id":6}]`

## **Search Location**

**URL:** [api/search](api/search)

**Method: GET**

**Param request:**

  * `name`, type: string, default: "undefined"
  * `term`, type: string

**Request example:**

  * `GET: {"name": "undefined", "term": "h"}`

** Response **

  `[{"name":"Dhaka","place_id":38},{"name":"Hanoi","place_id":41},{"name":"Phonmpenh","place_id":40}]`
