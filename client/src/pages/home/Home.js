import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { Component, useState } from 'react';
import MapView from 'react-native-maps';
import Map from './Map';
import { useNearByReports } from '../../hooks/useNearByReports';
import ReportListItem from './ReportListItem';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';
import { Feather } from '@expo/vector-icons';
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Provider,
} from 'react-native-paper';
import AddReportForm from './AddReportForm';
import ReportsListModel from './ReportsListModel';
import Layout from '../../shared/layout/Layout';
import ReportDetails from './ReportDetails';
import LoadingView from '../../shared/loading/LoadingView';

const Home = ({ navigation }) => {
  const [displayAdd, setDisplayAdd] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const { currentLocation, initRegion } = useCurrentLocation();

  const { data, isLoading, isError } = useNearByReports({
    lat: currentLocation.latitude,
    lng: currentLocation.longitude,
  });

  if (isLoading) return <LoadingView />;
  console.log(initRegion);
  return (
    <Layout>
      <Provider>
        <Portal>
          <Modal
            contentContainerStyle={styles.addNewModal}
            visible={displayAdd}
            onDismiss={() => setDisplayAdd(false)}
          >
            <AddReportForm onCancel={() => setDisplayAdd(false)} />
          </Modal>
        </Portal>
        <View style={styles.container}>
          <View style={styles.mapContainer}>
            <Map locations={data} initRegion={initRegion?.coords} />
          </View>
          <View style={styles.reportsItemsSection}>
            <View style={styles.plusContainer}>
              <TouchableOpacity
                onPress={() => setDisplayAdd(true)}
                style={styles.plus}
              >
                <Feather name='plus' size={40} color='#fff' />
              </TouchableOpacity>
            </View>
            <FlatList
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={data}
              renderItem={({ item }) => (
                <ReportListItem
                  key={item.id}
                  item={item}
                  horizontal={true}
                  currentLocation={currentLocation}
                  onPress={() => setSelectedReport(item)}
                />
              )}
            />
            <Button
              style={styles.btn}
              onPress={() => navigation.navigate('reports')}
            >
              Visa alla
            </Button>
          </View>
        </View>

        <Modal
          visible={selectedReport !== null}
          onDismiss={() => setSelectedReport(null)}
        >
          <IconButton
            icon='close'
            onPress={() => setSelectedReport(null)}
            style={styles.closeButton}
          />
          <ReportDetails
            report={selectedReport}
            currentLocation={currentLocation}
          />
        </Modal>
      </Provider>
    </Layout>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  mapContainer: {
    height: '70%',
  },
  plusContainer: {
    position: 'absolute',
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  plus: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 40,
  },
  addNewModal: {
    backgroundColor: '#fff',
    padding: 10,
  },
  reportsItemsSection: {
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  btn: {
    padding: 10,
  },
  closeButton: {
    backgroundColor: '#fff',
  },
});
