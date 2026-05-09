import React from 'react';
import {
    Plus,
    Trash2,
    Code2,
    Palette,
    Megaphone,
    MonitorSmartphone,
    Laptop,
    MessageCircle,
    FileText,
    PenTool,
    Presentation,
    LineChart
} from 'lucide-react';
import { Service } from '../../types';

interface ServicesTabProps {
    servicesFormData: Service[];
    setServicesFormData: (services: Service[]) => void;
    onAddService: () => void;
    onDeleteService: (index: number) => void;
    onSaveServices: (e: React.FormEvent) => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
    servicesFormData,
    setServicesFormData,
    onAddService,
    onDeleteService,
    onSaveServices
}) => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Services Settings</h1>
                    <p className="text-gray-500 text-sm">Update the services you provide on your portfolio.</p>
                </div>
                <button
                    onClick={onAddService}
                    className="bg-accent hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-lg shadow-accent/20"
                >
                    <Plus size={18} />
                    ADD NEW SERVICE
                </button>
            </div>

            <form onSubmit={onSaveServices} className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                    {servicesFormData.map((service, index) => (
                        <div key={index} className="bg-white dark:bg-[#111] p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6 relative group">
                            <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800 pb-4">
                                <h3 className="font-bold text-lg">Service {index + 1}</h3>
                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => onDeleteService(index)}
                                        className="p-2 text-gray-400 hover:text-red-500 rounded-xl transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
                                        title="Delete Service"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <div className={`p-3 rounded-xl ${service.color} text-white`}>
                                        {service.icon === 'Code2' && <Code2 size={20} />}
                                        {service.icon === 'Palette' && <Palette size={20} />}
                                        {service.icon === 'Megaphone' && <Megaphone size={20} />}
                                        {service.icon === 'MonitorSmartphone' && <MonitorSmartphone size={20} />}
                                        {service.icon === 'Laptop' && <Laptop size={20} />}
                                        {service.icon === 'MessageCircle' && <MessageCircle size={20} />}
                                        {service.icon === 'FileText' && <FileText size={20} />}
                                        {service.icon === 'PenTool' && <PenTool size={20} />}
                                        {service.icon === 'Presentation' && <Presentation size={20} />}
                                        {service.icon === 'LineChart' && <LineChart size={20} />}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={service.title}
                                        onChange={(e) => {
                                            const newServices = [...servicesFormData];
                                            newServices[index].title = e.target.value;
                                            setServicesFormData(newServices);
                                        }}
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Icon</label>
                                    <select
                                        value={service.icon}
                                        onChange={(e) => {
                                            const newServices = [...servicesFormData];
                                            newServices[index].icon = e.target.value;
                                            setServicesFormData(newServices);
                                        }}
                                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white appearance-none"
                                    >
                                        <option value="Code2">Code (Web Design)</option>
                                        <option value="Palette">Palette (Graphic Design)</option>
                                        <option value="Megaphone">Megaphone (Marketing)</option>
                                        <option value="MonitorSmartphone">Monitor & Phone (Web Design)</option>
                                        <option value="Laptop">Laptop (Web Development)</option>
                                        <option value="MessageCircle">Chat Bubbles (Social Media)</option>
                                        <option value="FileText">Document/ID (Branding)</option>
                                        <option value="PenTool">Pen Tool (Illustration)</option>
                                        <option value="Presentation">Presentation (Marketing)</option>
                                        <option value="LineChart">Line Chart (Analytics)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Description</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={service.description}
                                    onChange={(e) => {
                                        const newServices = [...servicesFormData];
                                        newServices[index].description = e.target.value;
                                        setServicesFormData(newServices);
                                    }}
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-2xl py-4 px-6 text-sm focus:ring-2 focus:ring-accent/50 transition-all dark:text-white resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        type="submit"
                        className="w-full bg-accent hover:bg-yellow-400 text-black font-bold py-4 rounded-2xl transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                    >
                        SAVE ALL SERVICES
                    </button>
                </div>
            </form>
        </div>
    );
};
