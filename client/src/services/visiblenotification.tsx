"use client";

import { useMemo, useState } from "react";
import type { Filter, Notification } from "@/features/landowner-Worker/notificationdata";

export type NotificationSort = "Newest First" | "Oldest First";

function notificationTimestamp(notification: Notification) {
  const value = notification.Date ?? notification.createdAt ?? notification.time;
  const timestamp = value ? Date.parse(value) : NaN;
  return Number.isNaN(timestamp) ? null : timestamp;
}

export function useVisibleNotifications(notifications: Notification[], search = "") {
  const [filter, setFilter] = useState<Filter>("All Notifications");
  const [sort, setSort] = useState<NotificationSort>("Newest First");

  const visibleNotifications = useMemo(() => {
    const term = search.trim().toLowerCase();

    return notifications.filter((notification) => {
        const matchesFilter = filter === "All Notifications"
          || (filter === "Unread" ? notification.unread : notification.type === filter);
        const searchableText = [notification._id, notification.title, notification.message, notification.type]
          .join(" ")
          .toLowerCase();

        return matchesFilter && (!term || searchableText.includes(term));
      })
      .sort((first, second) => {
        const firstTime = notificationTimestamp(first);
        const secondTime = notificationTimestamp(second);

        if (firstTime === null) return secondTime === null ? 0 : 1;
        if (secondTime === null) return -1;

        return sort === "Oldest First" ? firstTime - secondTime : secondTime - firstTime;
      });
  }, [notifications, search, filter, sort]);

  return { visibleNotifications, filter, setFilter, sort, setSort };
}
