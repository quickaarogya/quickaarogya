import * as React from "react";
import { Badge } from "./badge";
import { CheckCircle2, Clock, AlertTriangle, XCircle, RotateCcw, Activity } from "lucide-react";

export type ClinicalStatus =
  | "active"
  | "upcoming"
  | "completed"
  | "refill_required"
  | "paused"
  | "cancelled"
  | "in_consultation"
  | "checked_in"
  | "placed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "emergency_active";

interface StatusBadgeProps {
  status: ClinicalStatus | string;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const normalized = status.toLowerCase().replace(/-/g, "_");

  switch (normalized) {
    case "active":
    case "confirmed":
    case "delivered":
      return (
        <Badge variant="success" className={className}>
          {showIcon && <CheckCircle2 size={11} className="mr-1" />}
          {normalized === "active" ? "Active" : normalized === "confirmed" ? "Confirmed" : "Delivered"}
        </Badge>
      );

    case "refill_required":
    case "low_stock":
    case "emergency_active":
      return (
        <Badge variant="danger" className={className}>
          {showIcon && <AlertTriangle size={11} className="mr-1" />}
          {normalized === "emergency_active" ? "SOS Active" : "Refill Required"}
        </Badge>
      );

    case "in_consultation":
    case "checked_in":
    case "preparing":
      return (
        <Badge variant="teal" className={className}>
          {showIcon && <Activity size={11} className="mr-1" />}
          {normalized === "in_consultation" ? "In OPD" : normalized === "checked_in" ? "Checked In" : "Preparing"}
        </Badge>
      );

    case "upcoming":
    case "placed":
    case "pending":
    case "out_for_delivery":
      return (
        <Badge variant="info" className={className}>
          {showIcon && <Clock size={11} className="mr-1" />}
          {normalized === "out_for_delivery" ? "Out for Delivery" : normalized === "upcoming" ? "Upcoming" : "Booked"}
        </Badge>
      );

    case "paused":
    case "rescheduled":
      return (
        <Badge variant="warning" className={className}>
          {showIcon && <RotateCcw size={11} className="mr-1" />}
          {normalized === "paused" ? "Paused" : "Rescheduled"}
        </Badge>
      );

    case "cancelled":
    case "missed":
      return (
        <Badge variant="destructive" className={className}>
          {showIcon && <XCircle size={11} className="mr-1" />}
          {normalized === "cancelled" ? "Cancelled" : "Missed"}
        </Badge>
      );

    case "completed":
      return (
        <Badge variant="secondary" className={className}>
          {showIcon && <CheckCircle2 size={11} className="mr-1" />}
          Completed
        </Badge>
      );

    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
}
