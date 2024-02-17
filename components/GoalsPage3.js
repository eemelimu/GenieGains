import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryLabel, VictoryAxis, VictoryZoomContainer } from 'victory-native';

const GoalsPage = ({ data }) => {
  const [selectedGoal, setSelectedGoal] = useState(data[0]);
  const [selectedRange, setSelectedRange] = useState(null);

  const handleSelectRange = (domain) => {
    const start = domain.x[0];
    const end = domain.x[1];
    const stepsAchieved = selectedGoal.data.reduce((acc, curr) => {
      if (curr.date >= start && curr.date <= end) {
        return acc + curr.value;
      }
      return acc;
    }, 0);
    setSelectedRange({ start, end, stepsAchieved });
  };

  const dailyTarget = selectedGoal.target / ((selectedGoal.data[selectedGoal.data.length - 1].date - selectedGoal.date) / (1000 * 3600 * 24));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Goal:</Text>
      <View style={styles.dropdownContainer}>
        {data.map(goal => (
          <Text key={goal.id} style={styles.dropdownItem} onPress={() => setSelectedGoal(goal)}>{goal.name}</Text>
        ))}
      </View>
      <Text style={styles.title}>Goal: {selectedGoal.target} {selectedGoal.unit}</Text>
      <Text style={styles.title}>Expected Date: {new Date(selectedGoal.date).toLocaleDateString()}</Text>
      <VictoryChart
        width={350}
        height={220}
        containerComponent={<VictoryZoomContainer />}
        domain={{ y: [0, selectedGoal.target] }}
        scale={{ x: "time" }}
        onZoom={handleSelectRange}
      >
        <VictoryLine
          data={selectedGoal.data}
          x="date"
          y="value"
          style={{
            data: { stroke: "tomato" },
            parent: { border: "1px solid #ccc" }
          }}
          labels={({ datum }) => `${datum.value} steps\n${new Date(datum.date).toLocaleDateString()}`}
          labelComponent={<VictoryTooltip/>}
        />
        <VictoryLine
          data={[
            { x: selectedGoal.data[0].date, y: dailyTarget },
            { x: selectedGoal.data[selectedGoal.data.length - 1].date, y: dailyTarget }
          ]}
          style={{ data: { stroke: "green" } }}
        />
        {selectedRange && (
          <VictoryLabel
            text={`Between ${new Date(selectedRange.start).toLocaleDateString()} - ${new Date(selectedRange.end).toLocaleDateString()} you completed ${selectedRange.stepsAchieved} ${selectedGoal.unit}`}
            x={175}
            y={210}
            textAnchor="middle"
            style={{ fontSize: 12, fill: "black" }}
          />
        )}
        <VictoryAxis
          dependentAxis
          tickFormat={(tick) => `${tick}`}
        />
        <VictoryAxis
          tickFormat={(tick) => new Date(tick).toLocaleDateString()}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dropdownItem: {
    marginRight: 10,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
  },
});

export default GoalsPage;
