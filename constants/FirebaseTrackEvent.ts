export type EventNameType =
  | 'webapp_event_detail_page_view'
  | 'webapp_join_rave_popup_view'
  | 'webapp_popup_join_rave_button_click'
  | 'webapp_popup_join_rave_success'
  | 'webapp_popup_join_rave_failed'
  | 'webapp_join_rave_button_click'
  | 'webapp_join_rave_success'
  | 'webapp_join_rave_failed'
  | 'webapp_share_rave_button_click'

interface EventNameProps {
  eventDetailPageView: EventNameType;
  joinRavePopupView: EventNameType;
  popupJoinRaveButtonClick: EventNameType;
  popupJoinRaveSuccess: EventNameType;
  popupJoinRaveFailed: EventNameType;
  joinRaveButtonClick: EventNameType;
  joinRaveSuccess: EventNameType;
  joinRaveFailed: EventNameType;
  shareRaveButtonClick: EventNameType;
}

export const FirebaseTrackEventName: EventNameProps = {
  eventDetailPageView: 'webapp_event_detail_page_view',
  joinRavePopupView: 'webapp_join_rave_popup_view',
  popupJoinRaveButtonClick: 'webapp_popup_join_rave_button_click',
  popupJoinRaveSuccess: 'webapp_popup_join_rave_success',
  popupJoinRaveFailed: 'webapp_popup_join_rave_failed',
  joinRaveButtonClick: 'webapp_join_rave_button_click',
  joinRaveSuccess: 'webapp_join_rave_success',
  joinRaveFailed: 'webapp_join_rave_failed',
  shareRaveButtonClick: 'webapp_share_rave_button_click',
};
