import React, {
  useState,
} from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";

import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import {
  Ionicons,
} from "@expo/vector-icons";

import {
  StatusBar,
} from "expo-status-bar";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  COLORS,
} from "../../constants/colors";

import {
  temporaryTickets,
} from "../../data/tickets";

import {
  temporaryCustomers,
} from "../../data/customer";


import DateTimePicker from "@react-native-community/datetimepicker";

/* Header */
import EmployeeTicketDetailsHeader from "../../components/employee/navigation/EmployeeTicketDetailsHeader";

/* Ticket Details */
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

  const [
    selectedPrintDate,
    setSelectedPrintDate,
  ] = useState<Date>(
    new Date()
  );

  const [
    selectedPrintTime,
    setSelectedPrintTime,
  ] = useState<Date>(
    new Date()
  );

  const [
    showPrintDatePicker,
    setShowPrintDatePicker,
  ] = useState(false);

  const [
    showPrintTimePicker,
    setShowPrintTimePicker,
  ] = useState(false);

  const {
    ticketNo,
  } = useLocalSearchParams<{
    ticketNo?: string;
  }>();

  /*
   * -----------------------------------------------------
   * CANONICAL TICKET LOOKUP
   * -----------------------------------------------------
   */

  const ticket =
    temporaryTickets.find(
      (item) =>
        item.ticketNo === ticketNo
    );

  const customer =
    ticket
      ? temporaryCustomers.find(
        (item) =>
          item.id ===
          ticket.customerId
      )
      : undefined;

  /*
   * -----------------------------------------------------
   * SCREEN STATE
   * -----------------------------------------------------
   */

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

  /*
   * Temporary local remarks.
   *
   * Later:
   * API will become the authoritative source.
   */
  const [
    remarks,
    setRemarks,
  ] = useState(
    ticket?.remarks ?? []
  );

  /*
   * Temporary employee identity.
   *
   * Keep this consistent with the temporary
   * employee used in data/employee.ts.
   *
   * Later this comes from authentication/API.
   */
  const temporaryCurrentEmployee =
    "Pranesh Kute";

  /*
   * -----------------------------------------------------
   * PRINT VALUES
   * -----------------------------------------------------
   */

  const printDate =
    selectedPrintDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );

  const printTime =
    selectedPrintTime.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );

  /*
   * -----------------------------------------------------
   * REMARK / UPDATE HELPERS
   * -----------------------------------------------------
   */

  const getCurrentDateTime = () => {
    const now = new Date();

    return now.toLocaleString(
      "en-IN",
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

  const handleAddUpdate = (
    message: string
  ) => {
    const newRemark = {
      id: `remark-${Date.now()}`,

      createdAt:
        getCurrentDateTime(),

      createdBy:
        temporaryCurrentEmployee,

      message,
    };

    setRemarks((current) => [
      newRemark,
      ...current,
    ]);
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
              ticketNo:
                ticket.ticketNo,

              customerId:
                ticket.customerId,
            },
          });
        }}
        onPrintPress={() => {
          if (!ticket) {
            return;
          }

          const now =
            new Date();

          setSelectedPrintDate(
            now
          );

          setSelectedPrintTime(
            now
          );

          setPrintModalVisible(
            true
          );
        }}
      />

      {!customer || !ticket ? (
        <View
          style={styles.notFound}
        >
          <Ionicons
            name="ticket-outline"
            size={30}
            color={COLORS.iconGrey}
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
            Ticket information will be loaded
            from the API when backend integration
            is connected.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.content
          }
          showsVerticalScrollIndicator={
            false
          }
        >
          {/* Ticket Summary */}
          <TicketSummaryCard
            ticketNo={
              ticket.ticketNo
            }
            createdOn={
              ticket.date
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
              customer.company
            }
            contactName={
              customer.contactName
            }
          />

          {/* Tabs */}
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
                  customer.company
                }
                contactName={
                  customer.contactName
                }
                phone={
                  customer.contactNo
                }
                email={
                  customer.email
                }
                address={
                  customer.address
                }
              />

              <DeviceInfoCard
                model={
                  ticket.model
                }
                serialNumbers={
                  ticket.serialNumbers
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
                  ticket.assignedTo
                }
                assignedBy={
                  ticket.assignedBy
                }
                accountManager={
                  ticket.accountManager
                }
                priority={
                  ticket.priority
                }
                deadline={
                  ticket.deadline
                }
              />
            </>
          ) : (
            <>
              <ChangeStatusCard
                currentStatus={
                  ticket.status
                }
                onStatusPress={(
                  status
                ) => {
                  Alert.alert(
                    "Change Status",

                    `Status change to "${status}" will be connected when the API is available.`
                  );
                }}
              />

              <RemarksTimelineCard
                remarks={
                  remarks
                }
              />

              <TicketHistoryCard
                history={
                  ticket.history
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
        date={
          printDate
        }
        time={
          printTime
        }
        onClose={() =>
          setPrintModalVisible(
            false
          )
        }
        onDatePress={() =>
          setShowPrintDatePicker(
            true
          )
        }
        onTimePress={() =>
          setShowPrintTimePicker(
            true
          )
        }
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

      {showPrintDatePicker && (
        <DateTimePicker
          value={
            selectedPrintDate
          }
          mode="date"
          display={
            Platform.OS === "ios"
              ? "inline"
              : "default"
          }
          onChange={(
            event,
            date
          ) => {
            if (
              Platform.OS ===
              "android"
            ) {
              setShowPrintDatePicker(
                false
              );
            }

            if (
              event.type ===
              "dismissed" ||
              !date
            ) {
              return;
            }

            setSelectedPrintDate(
              date
            );

            if (
              Platform.OS ===
              "ios"
            ) {
              setShowPrintDatePicker(
                false
              );
            }
          }}
        />
      )}

      {showPrintTimePicker && (
        <DateTimePicker
          value={
            selectedPrintTime
          }
          mode="time"
          display={
            Platform.OS === "ios"
              ? "spinner"
              : "default"
          }
          is24Hour={false}
          onChange={(
            event,
            time
          ) => {
            if (
              Platform.OS ===
              "android"
            ) {
              setShowPrintTimePicker(
                false
              );
            }

            if (
              event.type ===
              "dismissed" ||
              !time
            ) {
              return;
            }

            setSelectedPrintTime(
              time
            );

            if (
              Platform.OS ===
              "ios"
            ) {
              setShowPrintTimePicker(
                false
              );
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
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