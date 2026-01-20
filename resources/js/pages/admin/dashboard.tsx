import AdminLayout from '@/layouts/admin-layout';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FileUpload from '@/components/file-upload';
import CustomToast, { ToastType } from '@/components/ui/custom-toast';
import { useEffect, useState } from 'react';
import { MousePointer2, Plus, Trash2, Link as LinkIcon, Save } from 'lucide-react';
import InputError from '@/components/input-error';

export default function Dashboard() {
    const { information, currentKey, errors, flash } = usePage<any>().props;
    const [existingFiles, setExistingFiles] = useState<any[]>([]);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        title: '',
        description: '',
        date: '',
        file: null as File | null,
        urls: [] as { label: string; url: string }[],
        _method: 'PATCH',
    });

    useEffect(() => {
        if (flash?.message) setToast({ message: flash.message, type: 'success' });
        if (flash?.error) setToast({ message: flash.error, type: 'error' });
    }, [flash]);


    useEffect(() => {
        if (information) {
            setData({
                title: information.title || '',
                description: information.description || '',
                date: information.date || '',
                urls: Array.isArray(information.urls) ? information.urls : [],
                file: null,
                _method: 'PATCH',
            });

            // Update existing files whenever information changes
            if (information.file_path) {
                setExistingFiles([{
                    id: information.id,
                    url: `${information.file_url}`,
                    name: information.file_path.split('/').pop(),
                    mime_type: information.mime_type,
                    path: information.file_path,
                }]);
            } else {
                setExistingFiles([]);
            }
        }
    }, [information]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // @ts-ignore - Inertia will handle FormData correctly
        post(route('admin.information.update', { key: currentKey }), {
            forceFormData: true,
            onSuccess: () => {
                // Clear the "New Files" preview after successful upload
                setData('file', null);
                reset('file');
                setToast({ message: "Updated successfully!", type: 'success' });
            },
            onError: () => {
                setToast({ message: "Error updating project.", type: 'error' });
            }
        });
    };

    const handleRemoveExisting = () => {
        if (confirm('Are you sure you want to remove this file? You must upload a new file to save the changes.')) {
            setExistingFiles([]);
        }
    };

    // Dynamic URL logic
    const addUrlRow = () => setData('urls', [...data.urls, { label: '', url: '' }]);
    const removeUrlRow = (index: number) => setData('urls', data.urls.filter((_, i) => i !== index));
    const updateUrlRow = (index: number, field: string, value: string) => {
        const newUrls = [...data.urls];
        newUrls[index] = { ...newUrls[index], [field]: value };
        setData('urls', newUrls);
    };

    return (
        <AdminLayout activeSlug="dashboard">
            <Head title="Admin Dashboard" />
            {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <section className="max-w-6xl mx-auto px-4 py-6">
                {/* Project Tabs */}
                <div className='flex flex-wrap gap-2 mb-8 border-b pb-4'>
                    {['snowboarder', 'liseagle_perching', 'art_calder', 'triamp', 'balloon', 'tensegrity', 'liseagle_morphing', 'dipper', 'art_parasit', 'airflow', 'art_mit'].map((key) => (
                        <Button
                            key={key}
                            variant={currentKey === key ? "default" : "outline"}
                            size="sm"
                            className='cursor-pointer capitalize'
                            onClick={() => router.get(route('admin.dashboard'), { key })}
                        >
                            {key.replace('_', ' ')}
                        </Button>
                    ))}
                </div>

                {!information ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-lg">
                        <MousePointer2 className="h-8 w-8 text-muted-foreground mb-4 animate-bounce" />
                        <h3 className="text-lg font-medium">No Project Selected</h3>
                        <p className="text-muted-foreground">Select a project to begin editing.</p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="bg-white p-8 rounded-xl border shadow-sm space-y-8">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-2xl font-bold capitalize">{currentKey.replace('_', ' ')}</h2>
                            <Button type="submit" disabled={processing} className='cursor-pointer capitalize'>
                                <Save className="w-4 h-4 mr-2" />
                                {processing ? 'Saving...' : 'Save Project'}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <Label>Title</Label>
                                    <Input value={data.title} onChange={e => setData('title', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Date</Label>
                                    <Input value={data.date} onChange={e => setData('date', e.target.value)} />
                                </div>
                                <div>
                                    <Label>Description</Label>
                                    <Textarea rows={4} value={data.description} onChange={e => setData('description', e.target.value)} />
                                </div>

                                <div className="space-y-3 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <Label className="flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4" /> Links
                                        </Label>
                                        <Button type="button" variant="outline" size="sm" className='cursor-pointer' onClick={addUrlRow}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    {data.urls.map((u, i) => (
                                        <div key={i} className="flex gap-2">
                                            <Input
                                                placeholder="Label"
                                                value={u.label}
                                                onChange={e => updateUrlRow(i, 'label', e.target.value)}
                                            />
                                            <Input
                                                placeholder="URL"
                                                value={u.url}
                                                onChange={e => updateUrlRow(i, 'url', e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className='cursor-pointer'
                                                onClick={() => removeUrlRow(i)}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Label>Project File</Label>
                                    {/* Badge for image or video based on mime type both are disabled and showing.but active based on existing mimetype with a indicator*/}
                                    <div className="mb-4 flex items-center gap-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${information.mime_type && information.mime_type.startsWith('image/')
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-200 text-gray-800'
                                                }`}
                                        >
                                            {information.mime_type && information.mime_type.startsWith('image/') && (
                                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                                            )}
                                            Image
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${information.mime_type && information.mime_type.startsWith('video/')
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-200 text-gray-800'
                                                }`}
                                        >
                                            {information.mime_type && information.mime_type.startsWith('video/') && (
                                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                                            )}
                                            Video
                                        </span>
                                    </div>
                                </div>

                                <FileUpload
                                    value={data.file}
                                    onChange={(file) => setData('file', file as File | null)}
                                    existingFiles={existingFiles}
                                    onRemoveExisting={handleRemoveExisting}
                                    accept="video/*,image/*"
                                    maxSize={500}
                                />
                                <InputError message={errors.file} />
                            </div>
                        </div>
                    </form>
                )}
            </section>
        </AdminLayout>
    );
}
