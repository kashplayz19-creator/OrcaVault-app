import React from 'react';
import { Box, Flex, Stack, Grid } from './StitchPrimitives';
import NexusLogo from './NexusLogo';

export default function LoadingDashboardPage() {
  return (
    <Box className="w-full h-screen border-none rounded-none bg-[#000000] p-6 flex flex-col gap-6 select-none overflow-hidden">
      <Flex className="h-20 w-full border-b border-[#1F2226] pb-4">
        <Flex gap="gap-6" className="w-full">
          <NexusLogo size={40} className="animate-pulse" />
          <div className="w-64 h-8 rounded-lg bg-[#0B0C0E] border border-[#1F2226] animate-[pulse_2000ms_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
        </Flex>
        <div className="w-80 h-8 rounded-lg bg-[#0B0C0E] border border-[#1F2226] animate-[pulse_2000ms_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
      </Flex>
      <Flex className="flex-1 overflow-hidden" gap="gap-6" align="items-stretch">
        <Stack className="flex-1 h-full" gap="gap-6">
          <Box className="h-24 animate-[pulse_2000ms_cubic-bezier(0.4,0,0.6,1)_infinite] border-[#1F2226]"></Box>
          <Grid cols="grid-cols-2" className="flex-1" gap="gap-6">
            <Box className="animate-[pulse_2000ms_cubic-bezier(0.4,0,0.6,1)_infinite] border-[#1F2226] p-8 flex flex-col">
              <div className="w-48 h-4 rounded bg-[#1F2226] mb-8"></div>
              <div className="flex-1 rounded-lg bg-[#121316] mb-4"></div>
            </Box>
            <Box className="animate-[pulse_2000ms_cubic-bezier(0.4,0,0.6,1)_infinite] border-[#1F2226] p-8 flex flex-col">
              <div className="w-48 h-4 rounded bg-[#1F2226] mb-8"></div>
              <Grid cols="grid-cols-2" gap="gap-4" className="flex-1">
                 <div className="rounded-lg bg-[#121316]"></div>
                 <div className="rounded-lg bg-[#121316]"></div>
              </Grid>
            </Box>
          </Grid>
          <Box className="h-[280px] animate-[pulse_2000ms_cubic-bezier(0.4,0,0.6,1)_infinite] border-[#1F2226] p-6 flex flex-col gap-4">
             <div className="w-96 h-6 rounded bg-[#121316] mb-4"></div>
             <div className="w-full flex-1 rounded bg-[#121316]"></div>
          </Box>
        </Stack>
        <Box className="w-[420px] h-full animate-[pulse_2000ms_cubic-bezier(0.4,0,0.6,1)_infinite] border-[#1F2226] p-8">
           <div className="w-full h-8 rounded bg-[#1F2226] mb-8"></div>
           <Stack gap="gap-4">
              <div className="w-full h-8 rounded bg-[#121316]"></div>
              <div className="w-full h-8 rounded bg-[#121316]"></div>
              <div className="w-5/6 h-8 rounded bg-[#121316]"></div>
              <div className="w-4/5 h-8 rounded bg-[#121316]"></div>
              <div className="w-full h-8 rounded bg-[#121316]"></div>
           </Stack>
        </Box>
      </Flex>
    </Box>
  );
}
