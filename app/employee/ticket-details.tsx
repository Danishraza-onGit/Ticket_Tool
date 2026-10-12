import React, {
  useEffect,
  useState,
} from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  addTicketRemark,
  fetchTicket,
  updateTicketStatus,
} from "../../api/tickets";

import type {
  Remark,
} from "../../api/tickets";

import type {
  Ticket,
} from "../../types/ticket";

import { COLORS } from "../../constants/colors";

/* EMPLOYEE HEADER */
import EmployeeTicketDetailsHeader from "../../components/employee/navigation/EmployeeTicketDetailsHeader";

/* EMPLOYEE TICKET DETAILS COMPONENTS */
import TicketSummaryCard from "../../components/employee/ticket-details/TicketSummaryCard";

import TicketDetailTabs, {
  TicketDetailTab,
} from "../../components/employee/ticket-details/TicketDetailsTabs";

import ProblemDescriptionCard from "../../components/employee/ticket-details/ProblemDescriptionCard";
import CustomerInfoCard from "../../components/employee/ticket-details/CustomerInfoCard";
import DeviceInfoCard from "../../components/employee/ticket-details/DeviceInfoCard";
import AssignmentCard from "../../components/employee/ticket-details/AssignmentCard";
import ChangeStatusCard from "../../components/employee/ticket-details/ChangeStatusCard";
import RemarksTimelineCard from "../../components/employee/ticket-details/RemarksTimelineCard";
import TicketHistoryCard from "../../components/employee/ticket-details/TicketHistoryCard";
import AddUpdateCard from "../../components/employee/ticket-details/AddUpdateCard";
import CallReportTimeModal from "../../components/employee/ticket-details/CallReportTimeModal";

export default function EmployeeTicketDetailsScreen() {
  const router = useRouter();

  const {
    srNo,
  } = useLocalSearchParams<{
    srNo?: string;
    ticketNo?: string;
  }>();

  const [ticket, setTicket] =
    useState<Ticket | null>(null);

  const [remarks, setRemarks] =
    useState<Remark[]>([]);

  const [
    activeTab,
    setActiveTab,
  ] = useState<TicketDetailTab>(
    "overview"
  );

  const [
    printModalVisible,
    setPrintModalVisible,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [
    isUpdatingStatus,
    setIsUpdatingStatus,
  ] = useState(false);

  const [
    isAddingRemark,
    setIsAddingRemark,
  ] = useState(false);

  const formatHistoryDateTime = (
    value: string | null | undefined
  ) => {
    if (!value) {
      return "—";
    }

    return new Date(
      value
    ).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );
  };

  useEffect(() => {
    let active = true;

    const loadTicket = async () => {
      if (!srNo) {
        setLoadError(
          "Ticket identifier is missing."
        );
        setIsLoading(false);
        return;
      }

      const numericSrNo =
        Number(srNo);

      if (
        Number.isNaN(numericSrNo)
      ) {
        setLoadError(
          "Invalid ticket identifier."
        );
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const detail =
          await fetchTicket(
            numericSrNo
          );

        if (!active) {
          return;
        }

        setTicket(detail.ticket);
        setRemarks(detail.remarks);
      } catch (error) {
        console.log(
          "Employee ticket details API error:",
          error
        );

        if (!active) {
          return;
        }

        setLoadError(
          "Unable to load ticket details."
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void loadTicket();

    return () => {
      active = false;
    };
  }, [srNo]);

  const ticketHistory =
    ticket
      ? [
          {
            id: "status",
            label: ticket.status,
            timestamp:
              formatHistoryDateTime(
                ticket.updatedAt
              ),
          },
          {
            id: "created",
            label: "Ticket created",
            timestamp:
              formatHistoryDateTime(
                ticket.createdAt
              ),
          },
        ]
      : [];

  const assignedToText =
    ticket?.assignees?.length
      ? ticket.assignees
          .map(
            (assignee) =>
              assignee.displayName
          )
          .join(", ")
      : "—";

  const displayRemarks =
    remarks.map((remark) => ({
      id: String(remark.id),

      createdAt:
        new Date(
          remark.createdAt
        ).toLocaleString(
          "en-IN"
        ),

      createdBy:
        remark.createdBy ?? "—",

      message:
        remark.body,
    }));

  const printDate =
    ticket?.ticketDate
      ? new Date(
          `${ticket.ticketDate}T00:00:00`
        ).toLocaleDateString(
          "en-GB"
        )
      : "—";

  const printTime =
    new Date().toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

  const handleAddUpdate =
    async (
      message: string
    ) => {
      if (!ticket) {
        return;
      }

      const trimmedMessage =
        message.trim();

      if (!trimmedMessage) {
        Alert.alert(
          "Remark Required",
          "Please enter a remark before submitting."
        );
        return;
      }

      if (isAddingRemark) {
        return;
      }

      try {
        setIsAddingRemark(true);

        const createdRemark =
          await addTicketRemark(
            ticket.srNo,
            trimmedMessage
          );

        setRemarks(
          (current) => [
            ...current,
            createdRemark,
          ]
        );
      } catch (error) {
        console.log(
          "Employee add remark error:",
          error
        );

        Alert.alert(
          "Unable to Add Remark",
          "The remark could not be saved. Please try again."
        );
      } finally {
        setIsAddingRemark(false);
      }
    };

  const handleStatusChange = (
    nextStatus:
      Ticket["status"]
  ) => {
    if (
      !ticket ||
      isUpdatingStatus
    ) {
      return;
    }

    if (
      nextStatus ===
      ticket.status
    ) {
      return;
    }

    const confirmChange =
      async () => {
        try {
          setIsUpdatingStatus(
            true
          );

          const updatedTicket =
            await updateTicketStatus(
              ticket.srNo,
              nextStatus
            );

          setTicket(
            updatedTicket
          );
        } catch (error) {
          console.log(
            "Employee update ticket status error:",
            error
          );

          Alert.alert(
            "Unable to Change Status",
            "The ticket status could not be updated. Please try again."
          );
        } finally {
          setIsUpdatingStatus(
            false
          );
        }
      };

    if (
      nextStatus === "Closed"
    ) {
      Alert.alert(
        "Close this ticket?",
        "This marks the ticket as resolved. If the customer hasn't already been notified, they may be notified about the closure.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: () => {
              void confirmChange();
            },
          },
        ]
      );

      return;
    }

    Alert.alert(
      `Change status to ${nextStatus}?`,
      `This will change the ticket's status from ${ticket.status} to ${nextStatus}.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            void confirmChange();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={styles.screen}
    >
      <StatusBar style="dark" />

      <EmployeeTicketDetailsHeader
        onBackPress={() =>
          router.back()
        }
        onEditPress={() => {
          if (!ticket) {
            return;
          }

          router.push({
            pathname:
              "/employee/edit-ticket",

            params: {
              srNo:
                String(
                  ticket.srNo
                ),

              ticketNo:
                ticket.ticketNo,
            },
          });
        }}
        onPrintPress={() =>
          setPrintModalVisible(
            true
          )
        }
      />

      {isLoading ? (
        <View
          style={styles.notFound}
        >
          <Text
            style={
              styles.notFoundTitle
            }
          >
            Loading ticket...
          </Text>
        </View>
      ) : loadError ? (
        <View
          style={styles.notFound}
        >
          <Ionicons
            name="alert-circle-outline"
            size={30}
            color={
              COLORS.iconGrey
            }
          />

          <Text
            style={
              styles.notFoundTitle
            }
          >
            Unable to load ticket
          </Text>

          <Text
            style={
              styles.notFoundText
            }
          >
            {loadError}
          </Text>
        </View>
      ) : !ticket ? (
        <View
          style={styles.notFound}
        >
          <Ionicons
            name="ticket-outline"
            size={30}
            color={
              COLORS.iconGrey
            }
          />

          <Text
            style={
              styles.notFoundTitle
            }
          >
            Ticket details unavailable
          </Text>

          <Text
            style={
              styles.notFoundText
            }
          >
            The requested ticket could not be loaded.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={
            styles.scrollView
          }
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          <TicketSummaryCard
            ticketNo={
              ticket.ticketNo
            }
            createdOn={
              ticket.ticketDate
            }
            status={
              ticket.status
            }
            priority={
              ticket.priority
            }
            callType={
              ticket.callType
            }
            companyName={
              ticket.companyName
            }
            contactName={
              ticket.contactName ??
              "—"
            }
            contactNo={
              ticket.contactNo
            }
            emailId={
              ticket.emailId
            }
          />

          <TicketDetailTabs
            activeTab={
              activeTab
            }
            onTabChange={
              setActiveTab
            }
          />

          {activeTab ===
          "overview" ? (
            <>
              <ProblemDescriptionCard
                problem={
                  ticket.problem
                }
              />

              <CustomerInfoCard
                companyName={
                  ticket.companyName
                }
                contactName={
                  ticket.contactName ??
                  "—"
                }
                phone={
                  ticket.contactNo ??
                  "—"
                }
                email={
                  ticket.emailId ??
                  "—"
                }
                address={
                  ticket.address ??
                  "—"
                }
              />

              <DeviceInfoCard
                model={
                  ticket.model ??
                  "—"
                }
                serialNumbers={
                  ticket.serialNumber ??
                  "—"
                }
                internalTag={
                  ticket.internalTag
                }
                callType={
                  ticket.callType
                }
                mode={
                  ticket.mode
                }
              />

              <AssignmentCard
                assignedTo={
                  assignedToText
                }
                assignedBy={
                  ticket.assignedBy ??
                  "—"
                }
                accountManager={
                  ticket.accountManager ||
                  "—"
                }
                priority={
                  ticket.priority
                }
                deadline={
                  ticket.deadlineDate ??
                  "—"
                }
              />
            </>
          ) : (
            <>
              <ChangeStatusCard
                currentStatus={
                  ticket.status
                }
                onStatusPress={
                  handleStatusChange
                }
              />

              <TicketHistoryCard
                history={
                  ticketHistory
                }
                inventory={
                  ticket.inventory
                }
              />

              <RemarksTimelineCard
                remarks={
                  displayRemarks
                }
              />

              <AddUpdateCard
                onAddUpdate={
                  handleAddUpdate
                }
              />
            </>
          )}
        </ScrollView>
      )}

      <CallReportTimeModal
        visible={
          printModalVisible
        }
        date={printDate}
        time={printTime}
        onClose={() =>
          setPrintModalVisible(
            false
          )
        }
        onDatePress={() => {
          // Native print date selection can be connected
          // when report generation is implemented.
        }}
        onTimePress={() => {
          // Native print time selection can be connected
          // when report generation is implemented.
        }}
        onPrint={() => {
          setPrintModalVisible(
            false
          );

          Alert.alert(
            "Print Call Report",
            "Call report generation will be connected when the printing/report functionality is available."
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    /* LAYOUT */
    screen: {
      flex: 1,
      backgroundColor:
        COLORS.background,
    },

    scrollView: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 110,
    },

    /* LOADING / ERROR */
    notFound: {
      flex: 1,
      paddingHorizontal: 40,
      alignItems: "center",
      justifyContent: "center",
    },

    notFoundTitle: {
      marginTop: 10,
      fontSize: 13,
      fontWeight: "700",
      color:
        COLORS.textBody,
    },

    notFoundText: {
      marginTop: 6,
      textAlign: "center",
      fontSize: 10,
      lineHeight: 15,
      color:
        COLORS.textMuted,
    },
  });
