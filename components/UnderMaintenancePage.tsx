import React from 'react';
import { motion } from 'framer-motion';

export const UnderMaintenancePage: React.FC = () => {
    return (
        <div className="min-h-screen w-full bg-[#fdfdfd] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Subtle Brick Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h30v30H0V0zm30 30h30v30H30V30z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                backgroundSize: '120px 120px'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-2xl w-full text-center relative z-10"
            >
                {/* Illustration Container */}
                <div className="mb-12 relative flex justify-center">
                    <div className="w-full max-w-[500px] aspect-[4/3] relative">
                        {/* Using the generated image */}
                        <img
                            src="/maintenance_toolbox.png"
                            alt="Maintenance Tools"
                            className="w-full h-full object-contain filter drop-shadow-xl"
                        />
                    </div>

                    {/* Decorative elements to mimic the hand-drawn feel */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gray-200/50 rounded-full blur-sm" />
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                        Website under maintenance....
                    </h1>

                    <div className="space-y-2">
                        <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                            Our website is currently undergoing scheduled maintenance.
                        </p>
                        <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                            We should be back shortly. Thank you for your patience.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Subtle footer credit or branding if needed */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                REX PORTFOLIO • ADMIN CONTROL
            </div>
        </div>
    );
};
