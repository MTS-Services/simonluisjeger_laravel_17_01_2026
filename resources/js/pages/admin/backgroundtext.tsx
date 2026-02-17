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

export default function BackgroundText({information}: any) {
    const { errors, flash } = usePage<any>().props;
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        text1: '',
        text2: '',
    });

    useEffect(() => {
        if (flash?.message) setToast({ message: flash.message, type: 'success' });
        if (flash?.error) setToast({ message: flash.error, type: 'error' });
    }, [flash]);


    useEffect(() => {
        if (information) {
            setData({
                text1: information.text1 || '',
                text2: information.text2 || '',
            });
        }
    }, [information,flash]);

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
                        </div>
                    </div>
                </form> 
            </section>  
        </AdminLayout>
    );
}
