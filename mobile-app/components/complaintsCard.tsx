import { View, Text } from 'react-native';

const STEPS = [
  { key: 'submitted',   label: 'Submitted',   date: 'Mar 28' },
  { key: 'in_progress', label: 'In Progress', date: 'Mar 30' },
  { key: 'resolved',    label: 'Resolved',    date: null },
];

type Status = 'submitted' | 'in_progress' | 'resolved';

const statusIndex: Record<Status, number> = {
  submitted: 0,
  in_progress: 1,
  resolved: 2,
};

const statusColor: Record<Status, string> = {
  submitted: 'text-yellow-500',
  in_progress: 'text-blue-600',
  resolved: 'text-green-600',
};

export const ComplaintCard = ({ item }: { item: any }) => {
  const currentStep = statusIndex[item.status as Status] ?? 0;

  return (
    <View className="bg-white p-4 m-2 rounded-xl shadow-sm">

      {/* Title */}
      <Text className="text-base font-medium text-gray-900">
        {item.title}
      </Text>

      {/* Description */}
      <Text className="text-sm text-gray-500 mt-1">
        {item.description}
      </Text>

      {/* Status label + value on separate lines */}
      <View className="mt-2">
        <Text className="text-xs text-gray-400">Status</Text>
        <Text className={`text-xs font-medium mt-0.5 ${statusColor[item.status as Status]}`}>
          {item.status === 'in_progress' ? 'In Progress'
            : item.status === 'resolved' ? 'Resolved'
            : 'Submitted'}
        </Text>
      </View>

      {/* Timeline */}
      <View className="flex-row items-start mt-4">
        {STEPS.map((step, index) => {
          const isDone    = index < currentStep;
          const isActive  = index === currentStep;
          const isPending = index > currentStep;

          return (
            <View key={step.key} className="flex-row items-start flex-1">

              {/* Step column */}
              <View className="items-center flex-1">

                {/* Dot */}
                <View className={`w-5 h-5 rounded-full items-center justify-center
                  ${isDone    ? 'bg-green-500' : ''}
                  ${isActive  ? 'bg-blue-600'  : ''}
                  ${isPending ? 'bg-gray-200'  : ''}
                `}>
                  {isDone && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                  {isActive && (
                    <View className="w-2 h-2 rounded-full bg-white" />
                  )}
                </View>

                {/* Step label */}
                <Text className={`text-xs font-medium mt-1 text-center
                  ${isDone    ? 'text-green-600' : ''}
                  ${isActive  ? 'text-blue-600'  : ''}
                  ${isPending ? 'text-gray-400'  : ''}
                `}>
                  {step.label}
                </Text>

                {/* Step date */}
                <Text className="text-xs text-gray-400 mt-0.5">
                  {step.date ?? '—'}
                </Text>

              </View>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <View className={`h-0.5 flex-1 mt-2.5
                  ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
                `} />
              )}

            </View>
          );
        })}
      </View>

    </View>
  );
};

export default ComplaintCard;