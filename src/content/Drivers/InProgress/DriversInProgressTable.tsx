import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Card,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Select,
  MenuItem,
  Typography,
  useTheme,
  CardHeader,
  CircularProgress
} from '@mui/material';

import Label from '@/components/Label';
import { CryptoOrderStatus } from '@/models/crypto_order';
import BulkActions from './BulkActions';
import { AppointmentStatus, AppointmentView, RouteType } from '@/types';
import { CheckBox } from '@mui/icons-material';
import { completeRoute } from '@/helpers/api-utils';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/contexts/AppointmentsContext';

interface RecentOrdersTableProps {
  className?: string;
  appointments: AppointmentView[];
}

interface Filters {
  status?: CryptoOrderStatus;
}

const getStatusLabel = (cryptoOrderStatus: AppointmentStatus): JSX.Element => {
  const map = {
    'PICKUP': {
      text: 'Pickup',
      color: 'error'
    },
    'DROPOFF': {
      text: 'Completed',
      color: 'success'
    },
    'COMPLETED': {
      text: 'Pending',
      color: 'warning'
    }
  };

  const { text, color }: any = map[cryptoOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const applyFilters = (
  appointments: AppointmentView[],
  filters: Filters
): AppointmentView[] => {
  return appointments.filter((cryptoOrder) => {
    let matches = true;

    return matches;
  });
};

const applyPagination = (
  appointments: AppointmentView[],
  page: number,
  limit: number
): AppointmentView[] => {
  return appointments.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable: FC<RecentOrdersTableProps> = ({ appointments }) => {
  const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>([]);
  const selectedBulkActions = selectedCryptoOrders.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    status: null
  });
  const { token } = useAuth()
  const { updateAppointments } = useAppointments();

  const callCompleteRoute = async (appointment: AppointmentView) => {
    setLoading(true)
    completeRoute(token, appointment).then( (data: AppointmentView) => {
      data.status = AppointmentStatus.COMPLETED
      setLoading(false);
      updateAppointments(data)
    })
  }

  const statusOptions = [
    {
      id: 'all',
      name: 'All'
    },
    {
      id: AppointmentStatus.COMPLETED,
      name: 'Completed'
    },
    {
      id: 'pending',
      name: 'Pending'
    },
  ];

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value
    }));
  };

  const handleSelectAllCryptoOrders = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedCryptoOrders(
      event.target.checked
        ? appointments.map((cryptoOrder) => cryptoOrder.appointmentId)
        : []
    );
  };

  const handleSelectOneCryptoOrder = (
    _event: ChangeEvent<HTMLInputElement>,
    cryptoOrderId: string
  ): void => {
    if (!selectedCryptoOrders.includes(cryptoOrderId)) {
      setSelectedCryptoOrders((prevSelected) => [
        ...prevSelected,
        cryptoOrderId
      ]);
    } else {
      setSelectedCryptoOrders((prevSelected) =>
        prevSelected.filter((id) => id !== cryptoOrderId)
      );
    }
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCryptoOrders = applyFilters(appointments, filters);
  const paginatedCryptoOrders = applyPagination(
    filteredCryptoOrders,
    page,
    limit
  );
  const selectedSomeCryptoOrders =
    selectedCryptoOrders.length > 0 &&
    selectedCryptoOrders.length < appointments.length;
  const selectedAllCryptoOrders =
    selectedCryptoOrders.length === appointments.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <Box width={150}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || 'all'}
                  onChange={handleStatusChange}
                  label="Status"
                  autoWidth
                >
                  {statusOptions.map((statusOption) => (
                    <MenuItem key={statusOption.id} value={statusOption.id}>
                      {statusOption.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          }
          title="In Progress"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllCryptoOrders}
                  indeterminate={selectedSomeCryptoOrders}
                  onChange={handleSelectAllCryptoOrders}
                />
              </TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Directions</TableCell>
              <TableCell align="right">Distance</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCryptoOrders.map((cryptoOrder: AppointmentView) => {
              const isCryptoOrderSelected = selectedCryptoOrders.includes(
                cryptoOrder.appointmentId
              );
              return (
                <TableRow
                  hover
                  key={cryptoOrder.appointmentId + " " + cryptoOrder.type}
                  selected={isCryptoOrderSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isCryptoOrderSelected}
                      onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        handleSelectOneCryptoOrder(event, cryptoOrder.appointmentId)
                      }
                      value={isCryptoOrderSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {format(new Date(cryptoOrder.date), 'p')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {format(new Date(cryptoOrder.date), 'MMMM dd yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {cryptoOrder.customer}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      <a href={`tel:${cryptoOrder.customerPhoneNumber}`}>{cryptoOrder.customerPhoneNumber}</a>
                    </Typography>
                  </TableCell>
                  <TableCell>
                  <Typography
                      variant="body1"
                      // fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      
                      <b>{cryptoOrder.type.toUpperCase()}</b> 
                    </Typography>
                    <Typography
                      variant="body2"
                      // fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      
                      <b>From:</b> {cryptoOrder.type == RouteType.PICKUP ? cryptoOrder.address : cryptoOrder.cleaningAddress}
                    </Typography>
                    <Typography
                      variant="body2"
                      // fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      <b>To:</b> {cryptoOrder.type == RouteType.DROPOFF ? cryptoOrder.address : cryptoOrder.cleaningAddress}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {cryptoOrder.distance} Km
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      $ {numeral(cryptoOrder.distance).format(
                        `${cryptoOrder.basePay.toFixed(2)}`
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                  { !loading && 
                    <Tooltip title={`Complete ${cryptoOrder.type.toLowerCase()}`} arrow onClick={() => callCompleteRoute(cryptoOrder)}>
                      <IconButton
                        sx={{
                          '&:hover': {
                            background: theme.colors.primary.lighter
                          },
                          color: theme.palette.primary.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <CheckBox fontSize="small" />  
                        
                      </IconButton>
                    </Tooltip>||
                        <CircularProgress/> }
                    {/* <Tooltip title="Delete Order" arrow>
                      <IconButton
                        sx={{
                          '&:hover': { background: theme.colors.error.lighter },
                          color: theme.palette.error.main
                        }}
                        color="inherit"
                        size="small"
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip> */}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredCryptoOrders.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

RecentOrdersTable.propTypes = {
  appointments: PropTypes.array.isRequired
};

RecentOrdersTable.defaultProps = {
  appointments: []
};

export default RecentOrdersTable;
