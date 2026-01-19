import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';

interface FileUpload {
    id: number;
    path: string;
    mime_type: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    fileUpload: FileUpload;
}

export default function Show({ fileUpload }: Props) {
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this file?')) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/fileupload/${fileUpload.id}`;
            form.innerHTML = `
                <input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''}">
                <input type="hidden" name="_method" value="DELETE">
            `;
            document.body.appendChild(form);
            form.submit();
        }
    };

    return (
        <>
            <Head title={`File #${fileUpload.id}`} />
            <AppLayout>
                <div className="container mx-auto py-8 max-w-2xl">
                    <Link href="/fileupload" className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Files
                    </Link>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h1 className="text-3xl font-bold mb-6">File Details</h1>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-sm font-medium text-gray-600">File ID</label>
                                <p className="text-lg font-medium">{fileUpload.id}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">File Path</label>
                                <p className="text-lg font-medium break-all">{fileUpload.path}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">MIME Type</label>
                                <p className="text-lg font-medium">{fileUpload.mime_type}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Created At</label>
                                <p className="text-lg font-medium">{new Date(fileUpload.created_at).toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Updated At</label>
                                <p className="text-lg font-medium">{new Date(fileUpload.updated_at).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6 border-t">
                            <Link href={`/fileupload/${fileUpload.id}/edit`}>
                                <Button variant="outline">Edit</Button>
                            </Link>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
