"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Edit,
  FileText,
  RefreshCw,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  description: string;
  amount: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  category: string;
  accountId?: string;
  fromAccountId?: string;
  toAccountId?: string;
  date: string;
  status: string;
  isRecurring: boolean;
  tags?: string[];
  notes?: string;
  paymentId?: string;
}

interface TransactionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

export function TransactionDetailDialog({
  open,
  onOpenChange,
  transaction,
  onEdit,
  onDelete,
}: TransactionDetailDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!transaction) {
    return null;
  }

  const getTypeIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "INCOME":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case "EXPENSE":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case "TRANSFER":
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeBadgeColor = (type: Transaction["type"]) => {
    switch (type) {
      case "INCOME":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "EXPENSE":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "TRANSFER":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      default:
        return "";
    }
  };

  const getAmountColor = (type: Transaction["type"]) => {
    switch (type) {
      case "INCOME":
        return "text-green-600 dark:text-green-400";
      case "EXPENSE":
        return "text-red-600 dark:text-red-400";
      case "TRANSFER":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "";
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(transaction);
    }
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onDelete(transaction.id);
      toast.success("Transaction deleted successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(transaction.type)}
            Transaction Details
          </DialogTitle>
          <DialogDescription>
            View and manage transaction information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {transaction.description}
                <Badge className={getTypeBadgeColor(transaction.type)}>
                  {transaction.type.toLowerCase()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span
                  className={`text-2xl font-bold ${getAmountColor(
                    transaction.type
                  )}`}
                >
                  {transaction.type === "EXPENSE"
                    ? "-"
                    : transaction.type === "INCOME"
                    ? "+"
                    : ""}
                  ₱{parseFloat(transaction.amount).toLocaleString()}
                </span>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{transaction.category}</p>
                  </div>
                </div>
              </div>

              {transaction.isRecurring && (
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">Recurring Transaction</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transaction.type === "TRANSFER" ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">From Account</span>
                    <span className="font-medium">
                      {transaction.fromAccountId || "Unknown"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">To Account</span>
                    <span className="font-medium">
                      {transaction.toAccountId || "Unknown"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Account</span>
                  <span className="font-medium">
                    {transaction.accountId || "Unknown"}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    transaction.status === "COMPLETED" ? "default" : "secondary"
                  }
                >
                  {transaction.status.toLowerCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tags and Notes */}
          {(transaction.tags?.length || transaction.notes) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {transaction.tags?.length && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {transaction.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {transaction.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm bg-muted p-3 rounded-md">
                      {transaction.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            )}
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
