'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { BotMessageSquare, Loader2, Music4, Tv2 } from 'lucide-react';
import { handleGenreRecommendation, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

const initialState: FormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BotMessageSquare className="mr-2 h-4 w-4" />}
      Get Recommendations
    </Button>
  );
}

export function GenreForm() {
  const [state, formAction] = useFormState(handleGenreRecommendation, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-accent">
          <BotMessageSquare />
          AI Genre Tool
        </CardTitle>
        <CardDescription>
          Describe a mood or genre, and let our AI suggest what to watch or listen to.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="genre-description">Genre or Mood</Label>
            <Textarea
              id="genre-description"
              name="genreDescription"
              placeholder="e.g., 'Upbeat 80s synth-pop for a road trip' or 'Dark, atmospheric sci-fi TV shows'"
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
             <Label>Media Type</Label>
            <RadioGroup name="mediaType" defaultValue="radio" className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="radio" id="r-radio" />
                <Label htmlFor="r-radio" className="flex items-center gap-2 cursor-pointer">
                  <Music4 className="w-4 h-4 text-primary" /> Radio
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tv" id="r-tv" />
                <Label htmlFor="r-tv" className="flex items-center gap-2 cursor-pointer">
                  <Tv2 className="w-4 h-4 text-accent" /> TV
                </Label>
              </div>
            </RadioGroup>
          </div>

          <SubmitButton />
        </form>

        {(state.recommendations || state.message) && (
          <div className="mt-6">
            <h4 className="font-semibold">{state.message || 'Results:'}</h4>
            {state.recommendations && state.recommendations.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {state.recommendations.map((rec, index) => (
                  <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                    {rec}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
