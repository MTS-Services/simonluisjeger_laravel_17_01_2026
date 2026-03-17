import AdminLayout from '@/layouts/admin-layout';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomToast, { ToastType } from '@/components/ui/custom-toast';
import { useEffect, useState } from 'react';
import { MousePointer2, Plus, Trash2, Link as LinkIcon, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';

export default function BackgroundText({ information }: any) {
    const { errors, flash } = usePage<any>().props;
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        title: '',
        text1: '',
        text2: '',
        background_color: '#d9d9d9',
        text_color: '#e6e6e6',
        text1_link_word: '',
        text1_link_element_name: '',
    });

    useEffect(() => {
        if (flash?.message) setToast({ message: flash.message, type: 'success' });
        if (flash?.error) setToast({ message: flash.error, type: 'error' });
    }, [flash]);


    useEffect(() => {
        if (information) {
            setData({
                title: information.title || '',
                text1: information.text1 || '',
                text2: information.text2 || '',
                background_color: information.background_color || '#d9d9d9',
                text_color: information.text_color || '#e6e6e6',
                text1_link_word: information.text1_link_word || '',
                text1_link_element_name: information.text1_link_element_name || '',
            });
        }
    }, [information, flash]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.background_text.update', {
            forceFormData: true,
            onSuccess: () => {
                setToast({ message: "Updated successfully!", type: 'success' });
            },
            onError: () => {
                setToast({ message: "Error updating project.", type: 'error' });
            }
        }));
    };

    return (
        <AdminLayout activeSlug="background_text">
            <Head title="Background Text" />
            {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <section className="max-w-6xl mx-auto px-4 py-6">
                <form onSubmit={submit} className="bg-white p-8 rounded-xl border shadow-sm space-y-8">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h2 className="text-2xl font-bold capitalize">Background Text</h2>
                        <Button type="submit" disabled={processing} className='cursor-pointer capitalize'>
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Saving...' : 'Save Background Texts'}
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Site title (shown top right on home)</Label>
                                    <Input
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder="e.g. Simon Jeger" className="mt-1"
                                    />
                                    <InputError message={errors.title} />
                                </div>
                                <div>
                                    <Label>Site title link element name (e.g. snowboarder or http://www.google.com)</Label>
                                    <Input
                                        value={data.text1_link_element_name}
                                        onChange={e => setData('text1_link_element_name', e.target.value)}
                                        placeholder="Element name to open when site title is clicked"
                                        className="mt-1"
                                    />
                                    <InputError message={errors.text1_link_element_name} />
                                </div>
                            </div>
                            <div>
                                <Label>Text 1</Label>
                                <Textarea rows={4} value={data.text1} onChange={e => setData('text1', e.target.value)} />
                                <InputError message={errors.text1} />
                            </div>
                            <div>
                                <Label>Text 2</Label>
                                <Textarea rows={4} value={data.text2} onChange={e => setData('text2', e.target.value)} />
                                <InputError message={errors.text2} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Background Color</Label>
                                    <div className="flex items-center gap-3 mt-1">
                                        <input
                                            type="color"
                                            value={data.background_color}
                                            onChange={e => setData('background_color', e.target.value)}
                                            className="h-10 w-14 cursor-pointer rounded border p-1"
                                        />
                                        <Input
                                            value={data.background_color}
                                            onChange={e => setData('background_color', e.target.value)}
                                            maxLength={7}
                                            className="w-28 font-mono"
                                        />
                                    </div>
                                    <InputError message={errors.background_color} />
                                </div>
                                <div>
                                    <Label>Text Font Color</Label>
                                    <div className="flex items-center gap-3 mt-1">
                                        <input
                                            type="color"
                                            value={data.text_color}
                                            onChange={e => setData('text_color', e.target.value)}
                                            className="h-10 w-14 cursor-pointer rounded border p-1"
                                        />
                                        <Input
                                            value={data.text_color}
                                            onChange={e => setData('text_color', e.target.value)}
                                            maxLength={7}
                                            className="w-28 font-mono"
                                        />
                                    </div>
                                    <InputError message={errors.text_color} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </AdminLayout>
    );
}
