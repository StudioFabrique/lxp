import type { PropsWithChildren } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Activity } from "../../../../utils/interfaces/activity";
import ResourcePreview from "../../../../features/lesson/components/edit/activities/resources/preview/resource-preview";
import ResourceUpload from "../../../../features/lesson/components/edit/activities/resources/resource-upload";
import ActivityWrapper from "./ActivityWrapper";
import IFrameActivityResource from "./IFrameActivityResource";
import ImageActivityResource from "./ImageActivityResource";

import TextActivityResource from "./TextActivityResource";
import VideoActivityResource from "./VideoActivityResource";

type Props = {
  activityState: "read" | "edit" | "write";
  parentId: number;
  previewActivity: Activity | null;
  activityType: "text" | "image" | "video" | "iframe" | "resource";
  onClose: () => void;
  setActivityState: (state: "read" | "edit" | "write") => void;
  setPreviewActivity: (activity: Activity | null) => void;
  refreshActivityList: (message: string) => void;
  closePreviewActivity: () => void;
  uploadVideo: (fd: FormData) => void;
  data: {
    register: UseFormRegister<any>;
    errors: FieldErrors;
  };
  resourceActivitiesSubmitted: () => void;
  submitIframeActivity: (newActivity: { title: string; url: string }) => void;
  onCloseTextEditor: () => void;
};

export default function ActivityContent(props: PropsWithChildren<Props>) {
  console.log("PROPS", props.parentId);

  return (
    <>
      {props.activityType && props.activityType !== "text" ? (
        <ActivityWrapper
          activity={props.previewActivity}
          mode={props.activityState}
          onSwitchMode={props.setActivityState}
          onClose={props.closePreviewActivity}
        >
          {props.activityType === "video" ? (
            <VideoActivityResource
              activity={props.previewActivity ? props.previewActivity : null}
              mode={props.activityState}
              onClose={props.closePreviewActivity}
              onSubmit={props.uploadVideo}
              parent="resource"
            />
          ) : null}

          {props.activityState === "write" &&
          props.activityType === "resource" ? (
            <ResourceUpload
              onCancel={props.closePreviewActivity}
              onResetForm={() => {}}
              onSubmit={props.resourceActivitiesSubmitted}
            />
          ) : props.activityType === "resource" &&
            props.activityState !== "write" ? (
            <ResourcePreview
              activity={props.previewActivity!}
              onCancel={props.closePreviewActivity}
              parent="resource"
            />
          ) : null}

          {props.activityType === "image" ? (
            <ImageActivityResource
              resourceId={props.parentId}
              activity={props.previewActivity!}
              mode={props.activityState}
              onCancel={props.closePreviewActivity}
            />
          ) : null}

          {props.activityType === "iframe" ? (
            <IFrameActivityResource
              activity={props.previewActivity}
              mode={props.activityState}
              onSubmit={props.submitIframeActivity}
              onCancel={props.closePreviewActivity}
            />
          ) : null}
        </ActivityWrapper>
      ) : (
        <>
          {props.activityType === "text" ? (
            <>
              {props.activityState !== "read" ? (
                <TextActivityResource
                  parentId={props.parentId!}
                  activity={
                    props.previewActivity ? props.previewActivity : undefined
                  }
                  activityType={props.activityType}
                  onClose={props.onCloseTextEditor}
                  mode={props.activityState}
                  onSubmit={props.refreshActivityList}
                />
              ) : null}
              {props.activityState === "read" ? (
                <ActivityWrapper
                  activity={props.previewActivity}
                  mode={props.activityState}
                  onSwitchMode={props.setActivityState}
                  onClose={() => props.setPreviewActivity(null)}
                >
                  <TextActivityResource
                    parentId={props.parentId!}
                    activity={
                      props.previewActivity ? props.previewActivity : undefined
                    }
                    activityType={props.activityType}
                    onClose={props.onClose}
                    mode={props.activityState}
                    onSubmit={props.refreshActivityList}
                  />
                </ActivityWrapper>
              ) : null}
            </>
          ) : (
            props.children
          )}
        </>
      )}
    </>
  );
}
