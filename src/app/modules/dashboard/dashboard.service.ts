import { Doctor } from "../doctor/doctor.model";
import { Patient } from "../patient/patient.model";
import { resolveRange } from "./dashboard.utils";

const dateFormatByGroup = {
  day: "%Y-%m-%d",
  month: "%Y-%m",
};

const getAnalyticsOverview = async (query: Record<string, unknown>) => {
  const { range } = query as { range?: string };
  const { startDate, endDate, groupBy } = resolveRange(range);

  const periodMatch: Record<string, unknown> = startDate
    ? { appointmentDate: { $gte: startDate, $lte: endDate } }
    : {};

  const [
    totalDoctors,
    totalPatients,
    patientsInPeriod,
    patientsByDate,
    patientsPerDoctor,
    patientsByCondition,
    upcomingPatients,
  ] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Patient.countDocuments(periodMatch),
    getPatientsByDate(periodMatch, groupBy),
    getPatientsPerDoctor(),
    getPatientsByCondition(periodMatch),
    getRecentPatients(),
  ]);

  const averagePerDoctor =
    totalDoctors > 0 ? Number((totalPatients / totalDoctors).toFixed(2)) : 0;

  return {
    range: { startDate, endDate, groupBy },
    summary: {
      totalDoctors,
      totalPatients,
      patientsInPeriod,
      averagePerDoctor,
    },
    patientsByDate,
    patientsPerDoctor,
    patientsByCondition,
    upcomingPatients,
  };
};

const getPatientsByDate = async (
  match: Record<string, unknown>,
  groupBy: "day" | "month",
) => {
  const result = await Patient.aggregate([
    {
      $match: {
        ...match,
        appointmentDate: {
          $exists: true,
          ...((match.appointmentDate as object) || {}),
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormatByGroup[groupBy],
            date: "$appointmentDate",
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: "$_id", count: 1 } },
  ]);

  return result;
};

const getPatientsPerDoctor = async () => {
  const result = await Patient.aggregate([
    { $group: { _id: "$doctor", patientCount: { $sum: 1 } } },
    {
      $lookup: {
        from: "doctors",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: "$doctor" },
    {
      $project: {
        _id: 0,
        doctorId: "$doctor._id",
        doctorName: "$doctor.name",
        specialization: "$doctor.specialization",
        patientCount: 1,
      },
    },
    { $sort: { patientCount: -1 } },
  ]);

  const coveredIds = result.map((r) => String(r.doctorId));
  const remaining = await Doctor.find({ _id: { $nin: coveredIds } }).select(
    "_id name specialization",
  );

  const zeroEntries = remaining.map((doc) => ({
    doctorId: doc._id,
    doctorName: doc.name,
    specialization: doc.specialization,
    patientCount: 0,
  }));

  return [...result, ...zeroEntries].sort(
    (a, b) => b.patientCount - a.patientCount,
  );
};

const CONDITION_TOP_N = 8;

const getPatientsByCondition = async (match: Record<string, unknown>) => {
  const result = await Patient.aggregate([
    { $match: { ...match, condition: { $exists: true, $ne: "" } } },
    { $group: { _id: "$condition", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  const top = result.slice(0, CONDITION_TOP_N);
  const rest = result.slice(CONDITION_TOP_N);
  const otherCount = rest.reduce((sum, r) => sum + r.count, 0);

  const formatted = top.map((r) => ({ condition: r._id, count: r.count }));
  if (otherCount > 0) {
    formatted.push({ condition: "Other", count: otherCount });
  }

  return formatted;
};

const getRecentPatients = async () => {
  const result = await Patient.find()
    .sort({ appointmentDate: 1 })
    .limit(5)
    .populate("doctor", "name")
    .select("name condition appointmentDate doctor");

  return result.map((p) => ({
    patientId: p._id,
    patientName: p.name,
    condition: p.condition,
    appointmentDate: p.appointmentDate,
    doctorName: (p.doctor as unknown as { name: string })?.name,
  }));
};

export const dashboardService = {
  getAnalyticsOverview,
};
