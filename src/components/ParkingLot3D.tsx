import { useState } from 'react';
import { Car, ParkingCircle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ParkingToken } from '@/types/parking';
interface ParkingLot3DProps {
  totalSlots: number;
  activeSessions: ParkingToken[];
}
export function ParkingLot3D({ totalSlots, activeSessions }: ParkingLot3DProps) {
  const [rotation, setRotation] = useState(0);
  const getSlotStatus = (slotNumber: number) => {
    return activeSessions.find(s => s.slotNumber === slotNumber);
  };
  const rotate = () => {
    setRotation((prev) => (prev + 45) % 360);
  };
  const rows = Math.ceil(Math.sqrt(totalSlots));
  const cols = Math.ceil(totalSlots / rows);
  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700 shadow-2xl">
      {}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={rotate}
          size="sm"
          variant="outline"
          className="bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg"
        >
          <RotateCw className="h-4 w-4 mr-2" />
          Rotate View
        </Button>
      </div>
      {}
      <div className="absolute inset-0 flex items-center justify-center perspective-[1200px]">
        <div
          className="relative preserve-3d transition-transform duration-1000 ease-out"
          style={{
            transform: `rotateX(45deg) rotateZ(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {}
          <div
            className="absolute inset-0 -z-10"
            style={{
              width: `${cols * 120}px`,
              height: `${rows * 140}px`,
              transform: 'translateZ(-10px)',
              background: 'linear-gradient(135deg, #1e293b 25%, transparent 25%), linear-gradient(225deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(315deg, #1e293b 25%, #0f172a 25%)',
              backgroundPosition: '0 0, 60px 0, 60px -60px, 0 60px',
              backgroundSize: '120px 120px',
            }}
          />
          {}
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: `repeat(${cols}, 100px)`,
              gridTemplateRows: `repeat(${rows}, 120px)`,
            }}
          >
            {Array.from({ length: totalSlots }, (_, i) => i + 1).map((slotNumber) => {
              const session = getSlotStatus(slotNumber);
              const isOccupied = session !== null;
              return (
                <div
                  key={slotNumber}
                  className="relative group cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {}
                  <div
                    className={`
                      relative w-full h-full rounded-lg border-2 transition-all duration-500
                      ${isOccupied 
                        ? 'bg-gradient-to-br from-red-500/30 to-red-600/20 border-red-500/50 shadow-lg shadow-red-500/30' 
                        : 'bg-gradient-to-br from-green-500/30 to-green-600/20 border-green-500/50 shadow-lg shadow-green-500/30'
                      }
                      group-hover:scale-105 group-hover:shadow-2xl
                    `}
                    style={{
                      transform: 'translateZ(0px)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${isOccupied ? 'text-red-300' : 'text-green-300'} opacity-50`}>
                        {slotNumber}
                      </span>
                    </div>
                    {}
                    <div className="absolute top-2 left-2 right-2 h-1 bg-white/20 rounded" />
                    <div className="absolute bottom-2 left-2 right-2 h-1 bg-white/20 rounded" />
                  </div>
                  {}
                  {isOccupied && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        transform: 'translateZ(30px)',
                        transformStyle: 'preserve-3d',
                        animation: 'float 3s ease-in-out infinite',
                      }}
                    >
                      {}
                      <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
                        {}
                        <div
                          className="relative w-16 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-2xl"
                          style={{
                            transform: 'translateZ(0px)',
                            transformStyle: 'preserve-3d',
                          }}
                        >
                          {}
                          <div
                            className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-5 bg-gradient-to-b from-cyan-200/30 to-cyan-400/20 rounded-t-lg"
                            style={{ transform: 'translateZ(1px)' }}
                          />
                          {}
                          <div className="absolute bottom-0 left-1 w-2 h-1 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50" />
                          <div className="absolute bottom-0 right-1 w-2 h-1 bg-yellow-300 rounded-full shadow-lg shadow-yellow-300/50" />
                        </div>
                        {}
                        <div
                          className="absolute -bottom-1 left-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"
                          style={{ transform: 'translateZ(-2px)' }}
                        />
                        <div
                          className="absolute -bottom-1 right-1 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-600"
                          style={{ transform: 'translateZ(-2px)' }}
                        />
                        {}
                        <div
                          className="absolute top-full left-1/2 -translate-x-1/2 w-20 h-6 bg-black/30 rounded-full blur-md"
                          style={{ transform: 'translateZ(-20px) rotateX(90deg)' }}
                        />
                      </div>
                    </div>
                  )}
                  {}
                  {!isOccupied && (
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity"
                      style={{
                        transform: 'translateZ(20px)',
                      }}
                    >
                      <ParkingCircle className="h-8 w-8 text-green-400 drop-shadow-lg" />
                    </div>
                  )}
                  {}
                  <div
                    className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap"
                    style={{
                      transform: 'translateZ(50px)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div className="bg-background/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-2xl border-2 border-border text-xs font-semibold">
                      Slot {slotNumber}
                      {isOccupied && session && (
                        <div className="text-red-500 mt-1">
                          {session.vehicleNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {}
          <div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-8"
            style={{ transform: 'translateZ(0px)' }}
          >
            <div className="px-4 py-2 bg-green-500/20 border-2 border-green-500/50 rounded-lg backdrop-blur-sm">
              <span className="text-xs font-bold text-green-300">ENTRANCE ▼</span>
            </div>
            <div className="px-4 py-2 bg-red-500/20 border-2 border-red-500/50 rounded-lg backdrop-blur-sm">
              <span className="text-xs font-bold text-red-300">EXIT ▲</span>
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-4 py-3 rounded-xl border-2 border-border shadow-2xl">
        <p className="text-xs font-semibold text-muted-foreground mb-2">3D Parking View</p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-green-500 shadow-sm shadow-green-500/50" />
            <span className="font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500 shadow-sm shadow-red-500/50" />
            <span className="font-medium">Occupied</span>
          </div>
        </div>
      </div>
      {}
      <style>{`
        .perspective-\[1200px\] {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
export default ParkingLot3D;
