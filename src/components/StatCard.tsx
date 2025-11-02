import React from 'react';
import { View, Text } from 'react-native';

type Props = {
  label: string;
  value: number | string;
  colorClass?: string;
};

const StatCard = ({ label, value, colorClass = 'bg-primary' }: Props) => {
  return (
    <View className={`flex-1 ${colorClass} rounded-2xl p-4 mr-4`}> 
      <Text className="text-white/80 text-xs">{label}</Text>
      <Text className="text-white text-2xl font-bold mt-1">{value}</Text>
    </View>
  );
};

export default StatCard;


