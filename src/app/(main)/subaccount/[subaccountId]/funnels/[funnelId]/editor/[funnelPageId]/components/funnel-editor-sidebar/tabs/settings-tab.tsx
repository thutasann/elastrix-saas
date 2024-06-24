'use client'

import React from 'react'
import { useEditor } from '@/providers/editor/editor-provider'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

function SettingsTab() {
  const { state, dispatch } = useEditor()

  const handleOnChanges = (e: any) => {}

  const handleChangeCustomValues = (e: any) => {}

  return (
    <Accordion type='multiple' className='h-full' defaultValue={['Typography', 'Dimensions']}>
      {/* Custom */}
      <AccordionItem value='Custom' className='px-6 py-0'>
        <AccordionTrigger className='!no-underline'>Custom</AccordionTrigger>
        <AccordionContent>
          {state.editor.selectedElement.type === 'link' && !Array.isArray(state.editor.selectedElement.content) && (
            <div className='flex flex-col gap-2'>
              <p className='text-muted-foreground'>Link Path</p>
              <Input
                id='href'
                placeholder='https:domain.example.com/pathname'
                onChange={handleChangeCustomValues}
                value={state.editor.selectedElement.content.href}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Typography */}
      <AccordionItem value='Typography' className='px-6 py-0'>
        <AccordionTrigger className='!no-underline'>Typography</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2'>
            <p className='text-muted-foreground'>Text Align</p>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'textAlign',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.textAlign}
            >
              <TabsList className='flex h-fit flex-row items-center justify-between gap-4 rounded-md border-[1px] bg-transparent'>
                <TabsTrigger value='left' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignLeft size={18} />
                </TabsTrigger>
                <TabsTrigger value='right' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignRight size={18} />
                </TabsTrigger>
                <TabsTrigger value='center' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignCenter size={18} />
                </TabsTrigger>
                <TabsTrigger value='justify' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignJustify size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-muted-foreground'>Font Family</p>
            <Input id='DM Sans' onChange={handleOnChanges} value={state.editor.selectedElement.styles.fontFamily} />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-muted-foreground'>Color</p>
            <Input id='color' onChange={handleOnChanges} value={state.editor.selectedElement.styles.color} />
          </div>
          <div className='flex gap-4'>
            <div className='flex flex-col gap-2'>
              <Label className='text-muted-foregroun4'>Weight</Label>
              <Select
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: 'font-weight',
                      value: e,
                    },
                  })
                }
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select a weight' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Font Weights</SelectLabel>
                    <SelectItem value='bold'>Bold</SelectItem>
                    <SelectItem value='normal'>Regular</SelectItem>
                    <SelectItem value='lighter'>Light</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-muted-foreground'>Size</Label>
              <Input
                placeholder='px'
                id='fontSize'
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.fontSize}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Dimensions */}
      <AccordionItem value='Dimensions' className='px-6 py-0'>
        <AccordionTrigger className='!no-underline'>Dimensions</AccordionTrigger>
        <AccordionContent>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4'>
                  <div>
                    <Label className='text-muted-foreground'>Height</Label>
                    <Input
                      id='height'
                      placeholder='px'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.height}
                    />
                  </div>
                  <div>
                    <Label className='text-muted-foreground'>Width</Label>
                    <Input
                      placeholder='px'
                      id='width'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.width}
                    />
                  </div>
                </div>
              </div>
              <p>Margin px</p>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4'>
                  <div>
                    <Label className='text-muted-foreground'>Top</Label>
                    <Input
                      id='marginTop'
                      placeholder='px'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginTop}
                    />
                  </div>
                  <div>
                    <Label className='text-muted-foreground'>Bottom</Label>
                    <Input
                      placeholder='px'
                      id='marginBottom'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginBottom}
                    />
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div>
                    <Label className='text-muted-foreground'>Left</Label>
                    <Input
                      placeholder='px'
                      id='marginLeft'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginLeft}
                    />
                  </div>
                  <div>
                    <Label className='text-muted-foreground'>Right</Label>
                    <Input
                      placeholder='px'
                      id='marginRight'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginRight}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <p>Padding px</p>
              <div className='flex flex-col gap-4'>
                <div className='flex gap-4'>
                  <div>
                    <Label className='text-muted-foreground'>Top</Label>
                    <Input
                      placeholder='px'
                      id='paddingTop'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingTop}
                    />
                  </div>
                  <div>
                    <Label className='text-muted-foreground'>Bottom</Label>
                    <Input
                      placeholder='px'
                      id='paddingBottom'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingBottom}
                    />
                  </div>
                </div>
                <div className='flex gap-4'>
                  <div>
                    <Label className='text-muted-foreground'>Left</Label>
                    <Input
                      placeholder='px'
                      id='paddingLeft'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingLeft}
                    />
                  </div>
                  <div>
                    <Label className='text-muted-foreground'>Right</Label>
                    <Input
                      placeholder='px'
                      id='paddingRight'
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingRight}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Decorations */}
      <AccordionItem value='Decorations' className='px-6 py-0'>
        <AccordionTrigger className='!no-underline'>Decorations</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4'>
          <div>
            <Label className='text-muted-foreground'>Opacity</Label>
            <div className='flex items-center justify-end'>
              <small className='p-2'>
                {typeof state.editor.selectedElement.styles?.opacity === 'number'
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat((state.editor.selectedElement.styles?.opacity || '0').replace('%', '')) || 0}
                %
              </small>
            </div>
            <Slider />
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Flexbox */}
      <AccordionItem value='Flexbox' className='px-6 py-0'>
        <AccordionTrigger className='!no-underline'>Flexbox</AccordionTrigger>
        <AccordionContent className='space-y-4'>
          {/* Justify Between */}
          <div className='flex flex-col gap-2'>
            <Label className='text-muted-foreground'>Justify Content</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'justifyContent',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.justifyContent}
            >
              <TabsList className='flex h-fit flex-row items-center justify-between gap-4 rounded-md border-[1px] bg-transparent'>
                <TabsTrigger value='space-between' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignHorizontalSpaceBetween size={18} />
                </TabsTrigger>
                <TabsTrigger value='space-evenly' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignHorizontalSpaceAround size={18} />
                </TabsTrigger>
                <TabsTrigger value='center' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignHorizontalJustifyCenterIcon size={18} />
                </TabsTrigger>
                <TabsTrigger value='start' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignHorizontalJustifyStart size={18} />
                </TabsTrigger>
                <TabsTrigger value='end' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignHorizontalJustifyEndIcon size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Align Items */}
          <div className='flex flex-col gap-2'>
            <Label className='text-muted-foreground'>Align Items</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'alignItems',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.alignItems}
            >
              <TabsList className='flex h-fit flex-row items-center justify-between gap-4 rounded-md border-[1px] bg-transparent'>
                <TabsTrigger value='center' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignVerticalJustifyCenter size={18} />
                </TabsTrigger>
                <TabsTrigger value='normal' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                  <AlignVerticalJustifyStart size={18} />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Flex */}
          <div className='flex items-center gap-2'>
            <Input
              className='h-4 w-4'
              placeholder='px'
              type='checkbox'
              id='display'
              onChange={(va) => {
                handleOnChanges({
                  target: {
                    id: 'display',
                    value: va.target.checked ? 'flex' : 'block',
                  },
                })
              }}
            />
            <Label className='text-muted-foreground'>Flex</Label>
          </div>

          {/* Direction */}
          <div className='flex flex-col gap-2'>
            <Label className='text-muted-foreground'> Direction</Label>
            <Input
              placeholder='px'
              id='flexDirection'
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.flexDirection}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export default SettingsTab
