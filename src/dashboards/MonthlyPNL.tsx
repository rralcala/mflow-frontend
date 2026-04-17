import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { fetcherEffect } from '../httpClient';
import { formatter } from '../lib';

const reportRoute = 'reports/monthly_pnl?oneOff=1';

type pnlRow = [number, Object];
type CardStates = Record<string, boolean>;

function renderRow(row: pnlRow, toggleCard: (id: string) => void, openCards: CardStates) {
  return (
    <Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{row[1]["month"]}</TableCell>
              <TableCell> </TableCell>
              <TableCell align="right">PYG</TableCell>
              <TableCell align="right">USD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => toggleCard(row[1]["month"])}
                >
                  {!!openCards[row[1]["month"]] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                Expenses
              </TableCell>
              <TableCell align="right">
                {formatter.format(row[1]["expenses_PYG"])}
              </TableCell>
              <TableCell align="right">{formatter.format(row[1]["expenses_USD"])}</TableCell>

            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                <Collapse in={!!openCards[row[1]["month"]]} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>

                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Asset</TableCell>
                          <TableCell align="right">Amount</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row[1]["expenses"].map((historyRow) => (
                          <TableRow hover key={historyRow[0]}>
                            <TableCell component="th" scope="row">
                              {historyRow[0]}
                            </TableCell>
                            <TableCell align="right">{formatter.format(historyRow[1])} {historyRow[2]}</TableCell>


                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
            <TableRow hover
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => toggleCard(row[1]["month"])}
                >
                  {!!openCards[row[1]["month"]] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                Income
              </TableCell>
              <TableCell align="right">
                {formatter.format(row[1]["income_PYG"])}
              </TableCell>

              <TableCell align="right">{formatter.format(row[1]["income_USD"])}</TableCell>


            </TableRow>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                <Collapse in={!!openCards[row[1]["month"]]} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>

                    <Table size="small" aria-label="purchases">
                      <TableHead>
                        <TableRow>
                          <TableCell>Asset</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {row[1]["income"].map((historyRow) => (
                          <TableRow hover key={historyRow[0]}>
                            <TableCell component="th" scope="row">
                              {historyRow[0]}
                            </TableCell>
                            <TableCell align="right">{formatter.format(historyRow[1])} {historyRow[2]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
            <TableRow hover
              //key={row[1]["expenses_PYG"]}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell></TableCell>
              <TableCell component="th" scope="row">
                <b>Total</b>
              </TableCell>
              <TableCell align="right"><b>
                {formatter.format(row[1]["income_PYG"] + row[1]["expenses_PYG"])}</b>
              </TableCell>

              <TableCell align="right"><b>{formatter.format(row[1]["income_USD"] + row[1]["expenses_USD"])}</b></TableCell>


            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <br />
    </Stack>);
}


export const DashboardMonthlyPNL = () => {
  const [dataR, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCards, setOpenCards] = useState<CardStates>({});

  const toggleCard = (id: string) => {

    setOpenCards((prev) => ({
      ...prev,
      // Toggle the value, defaulting to true if it didn't exist
      [id]: !prev[id],
    }));
    console.log(openCards)
  };
  useEffect(fetcherEffect(setData, setError, setLoading, reportRoute), []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(dataR["summary"]);
  return (
    <Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableBody>
            <TableRow hover>
              <TableCell>Year total</TableCell>
              <TableCell align="right">{formatter.format(dataR["summary"]["grand_total"][0])}</TableCell>
              <TableCell align="right">{formatter.format(dataR["summary"]["grand_total"][1])}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell>Income</TableCell>
              <TableCell align="right">{formatter.format(dataR["summary"]["income"][0])}</TableCell>
              <TableCell align="right">{formatter.format(dataR["summary"]["income"][1])}</TableCell>
            </TableRow>
            <TableRow hover>
              <TableCell><b>Year net</b></TableCell>
              <TableCell align="right"><b>{formatter.format(dataR["summary"]["year_net"][0])}</b></TableCell>
              <TableCell align="right"><b>{formatter.format(dataR["summary"]["year_net"][1])}</b></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <br/>
      {Object.entries(dataR["year_months"]).map((row) => (
        renderRow(row, toggleCard, openCards)
      ))}
    </Stack>
  );
};