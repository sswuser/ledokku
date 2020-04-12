import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import socketIOClient from 'socket.io-client';

import withApollo from '../../lib/withApollo';
import { config } from '../../config';
import { LoggedInLayout } from '../../layouts/LoggedInLayout';

interface RealtimeLog {
  message: string;
  type: 'command' | 'stdout' | 'stderr';
}

const Server = () => {
  const router = useRouter();
  const { serverId } = router.query;
  const [logs, setLogs] = useState<RealtimeLog[]>([]);

  useEffect(() => {
    const socket = socketIOClient(config.serverUrl);
    socket.on(`create-server:${serverId}`, (data: RealtimeLog) => {
      setLogs((previousLogs) => {
        const newLogs = [...previousLogs, data];
        return newLogs;
      });
      console.log('received create-server', data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <LoggedInLayout
      breadcrumb={[
        {
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          label: 'Berlin Library Project',
        },
      ]}
    >
      <p>Hello world</p>
      {logs.map((log, index) => (
        <p key={index}>
          <b>{log.type}:</b> {log.message}
        </p>
      ))}
    </LoggedInLayout>
  );
};

export default withApollo(Server);
